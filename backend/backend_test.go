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

	mysqlConfig := config
	mysqlConfig.DBName = ""
	db, err := sqlx.Connect("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		panic(err)
	}

	if _, err := db.Exec("CREATE DATABASE IF NOT EXISTS streetfoodlove"); err != nil {
		panic(err)
	}

	if err := db.Close(); err != nil {
		panic(err)
	}

	db, err = sqlx.Connect("mysql", config.FormatDSN())
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

	require.NoError(b.T(), b.backend.VendorCreate(user.ID, vendor))

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

func (b *BackendTestSuite) TestReviewCreate() {
	user := &database.UserProtected{
		User: &database.User{
			ID:       uuid.MustParse("1b006565-78eb-4f44-a816-65f5ab820fed"),
			UserType: database.UserTypeVendor,
		},
	}
	require.NoError(b.T(), b.backend.UserProtectedCreate(user, ""))

	vendor := &database.Vendor{
		ID:    uuid.MustParse("b1e2fbe3-3572-49d4-aad3-581f603ef357"),
		Owner: user.ID,
	}
	require.NoError(b.T(), b.backend.VendorCreate(user.ID, vendor))

	review := &database.Review{
		ID:       uuid.MustParse("2388137f-b166-4f7d-9e1b-d80485257537"),
		UserID:   user.ID,
		VendorID: vendor.ID,
	}

	{
		// Create review without discount
		result, err := b.backend.ReviewCreate(user.ID, review)
		b.NoError(err)
		b.False(result.DiscountCreated)

		discounts, err := b.backend.DiscountsByUser(review.UserID)
		b.NoError(err)
		b.Empty(discounts)
	}
	{
		// Create review and give discount
		vendor.DiscountEnabled = true
		require.NoError(b.T(), b.backend.VendorUpdate(user.ID, vendor))

		review.ID = uuid.MustParse("f8d3093d-1c8f-49ac-8f67-e38030eddb9b")

		result, err := b.backend.ReviewCreate(user.ID, review)
		b.NoError(err)
		b.True(result.DiscountCreated)

		discounts, err := b.backend.DiscountsByUser(review.UserID)
		b.NoError(err)
		b.Len(discounts, 1)

		// Get discount by secret
		discount, err := b.backend.DiscountsBySecret(discounts[0].Secret)
		b.NoError(err)
		b.Equal(discounts[0], *discount)

		// Delete discount
		b.Error(b.backend.DiscountDelete(uuid.UUID{}, discount.ID))
		b.NoError(b.backend.DiscountDelete(vendor.Owner, discount.ID))
	}
}

func (b *BackendTestSuite) TestNewChart() {
	result, err := b.backend.Database.NewChart()
	b.NoError(err)
	b.Empty(result)
}
