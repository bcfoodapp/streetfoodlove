package main

import (
	"database/sql"
	"github.com/DATA-DOG/go-txdb"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

func TestSelectReviewsAftertime(t *testing.T) {
	tests := []struct {
		reviews   []database.Review
		afterTime time.Time
		expected  []database.Review
	}{
		{
			nil,
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			[]database.Review{},
		},
		{
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 0, 0, time.UTC),
				},
			},
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			[]database.Review{},
		},
		{
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 0, 0, time.UTC),
				},
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 2, 0, time.UTC),
				},
			},
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 2, 0, time.UTC),
				},
			},
		},
	}

	for i, test := range tests {
		assert.Equal(t, test.expected, selectReviewsAfterTime(test.reviews, test.afterTime), i)
	}
}

// Integration tests for backend functions.
// Database must be running.
func TestBackendSuite(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	config := database.Development().MySQLConfig

	db, err := sqlx.Connect("mysql", config.FormatDSN())
	require.NoError(t, err)
	require.NoError(t, database.SetupTables(db))
	require.NoError(t, db.Close())

	txdb.Register("txdb", "mysql", config.FormatDSN())

	backend := &Backend{}
	defer func() {
		if err := backend.Close(); err != nil {
			panic(err)
		}
	}()

	tests := &BackendTestSuite{
		backend: backend,
	}
	suite.Run(t, tests)
}

type BackendTestSuite struct {
	suite.Suite
	backend *Backend
}

func (b *BackendTestSuite) SetupTest() {
	if b.backend.Database != nil {
		if err := b.backend.Database.Close(); err != nil {
			panic(err)
		}
	}
	db, err := sqlx.Connect("txdb", "identifier")
	if err != nil {
		panic(err)
	}
	b.backend.Database = database.NewDatabase(db)
}

func (b *BackendTestSuite) TestVendorCreate() {
	user := &database.UserProtected{
		User: &database.User{
			ID:       uuid.MustParse("1b006565-78eb-4f44-a816-65f5ab820fed"),
			UserType: database.UserTypeCustomer,
		},
	}

	vendor := &database.Vendor{
		ID:        uuid.MustParse("b1e2fbe3-3572-49d4-aad3-581f603ef357"),
		Latitude:  10,
		Longitude: 20,
		Owner:     user.ID,
	}

	{
		// Referenced user in Owner does not exist
		err := b.backend.VendorCreate(user.ID, vendor)
		b.ErrorIs(err, sql.ErrNoRows)
	}
	{
		require.NoError(b.T(), b.backend.UserProtectedCreate(user, ""))

		// User is not a vendor
		err := b.backend.VendorCreate(user.ID, vendor)
		b.Error(err)
	}
	{
		// Create Vendor
		user.UserType = database.UserTypeVendor
		require.NoError(b.T(), b.backend.UserProtectedUpdate(user.ID, user))
		err := b.backend.VendorCreate(user.ID, vendor)
		b.NoError(err)
	}
	{
		// Vendor already exists
		err := b.backend.VendorCreate(user.ID, vendor)
		b.Error(err)
	}
}

func (b *BackendTestSuite) TestVendorsByCoordinateBounds() {
	user := &database.UserProtected{
		User: &database.User{
			ID:       uuid.MustParse("1b006565-78eb-4f44-a816-65f5ab820fed"),
			UserType: database.UserTypeVendor,
		},
	}
	require.NoError(b.T(), b.backend.UserProtectedCreate(user, ""))

	vendor := &database.Vendor{
		ID:        uuid.MustParse("b1e2fbe3-3572-49d4-aad3-581f603ef357"),
		Latitude:  10,
		Longitude: 20,
		Owner:     user.ID,
	}

	{
		// Add vendor
		err := b.backend.VendorCreate(user.ID, vendor)
		require.NoError(b.T(), err)
	}
	{
		// No vendor within bounds
		vendors, err := b.backend.VendorsByCoordinateBounds(&database.CoordinateBounds{})
		b.NoError(err)
		b.Len(vendors, 0)
	}
	{
		// Find vendor in bounds
		bounds := &database.CoordinateBounds{
			NorthWestLat: 15,
			NorthWestLng: 15,
			SouthEastLat: 5,
			SouthEastLng: 25,
		}
		vendors, err := b.backend.VendorsByCoordinateBounds(bounds)
		b.NoError(err)
		b.Len(vendors, 1)

		b.Equal(vendor.ID, vendors[0])
	}
}
