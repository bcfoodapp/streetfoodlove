package main

import (
	"database/sql"
	"github.com/DATA-DOG/go-txdb"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/suite"
	"testing"
)

// Integration tests for backend functions.
// Database must be reset before running.
func TestBackendSuite(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	config := mysql.Config{
		User:                 "root",
		AllowNativePasswords: true,
		DBName:               "streetfoodlove",
		ParseTime:            true,
	}
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

func (b *BackendTestSuite) TestVendor() {
	vendor := &database.Vendor{
		ID:   uuid.MustParse("25aa0170-2746-424b-8f22-4c27ea528402"),
		Name: "new vendor",
	}
	{
		// Vendor does not exist
		_, err := b.backend.Vendor(vendor.ID)
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		// Invalid user ID
		err := b.backend.VendorCreate(uuid.UUID{}, vendor)
		b.Error(err)
	}
	{
		// User is not a vendor
		notVendor := uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4")
		err := b.backend.VendorCreate(notVendor, vendor)
		b.Error(err)
	}
	{
		// Create vendor
		vendorUser := uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a")
		err := b.backend.VendorCreate(vendorUser, vendor)
		b.NoError(err)

		result, err := b.backend.Vendor(vendor.ID)
		b.NoError(err)
		b.Equal(vendor, result)
	}
}

func (b *BackendTestSuite) TestUser() {
	user := &database.UserProtected{
		User: &database.User{
			ID:       uuid.MustParse("1b733820-9661-40a4-a898-dfe662b98002"),
			Username: "new user",
		},
	}
	{
		// User does not exist
		_, err := b.backend.UserProtected(user.ID, user.ID)
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		// Not authorized
		_, err := b.backend.UserProtected(uuid.UUID{}, user.ID)
		b.ErrorAs(err, &unauthorized)
	}
	{
		// Create user
		err := b.backend.UserProtectedCreate(user, "")
		b.NoError(err)

		result, err := b.backend.UserProtected(user.ID, user.ID)
		b.NoError(err)
		b.Equal(user.Username, result.Username)
	}
	{
		// User does not exist
		err := b.backend.UserProtectedUpdate(user.ID, &database.UserProtected{User: &database.User{}})
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		// Not authorized
		err := b.backend.UserProtectedUpdate(uuid.UUID{}, user)
		b.ErrorAs(err, &unauthorized)
	}
	{
		// Change username
		user.Username = "different username"
		err := b.backend.UserProtectedUpdate(user.ID, user)
		b.NoError(err, &unauthorized)
		result, err := b.backend.User(user.ID)
		b.NoError(err)
		b.Equal(user.Username, result.Username)
	}
}

func (b *BackendTestSuite) TestReview() {
	review := &database.Review{
		ID:       uuid.MustParse("e6f52c09-8954-48f0-a11c-348176dc455f"),
		Text:     "new review",
		VendorID: uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		UserID:   uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
	}
	{
		// Review does not exist
		_, err := b.backend.Review(review.ID)
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		// Not authorized
		err := b.backend.ReviewCreate(uuid.UUID{}, review)
		b.ErrorAs(err, &unauthorized)
	}
	{
		// Create review
		err := b.backend.ReviewCreate(review.UserID, review)
		b.NoError(err)

		result, err := b.backend.Review(review.ID)
		b.NoError(err)
		b.Equal(review.Text, result.Text)
	}
	{
		// Review not found
		reviews, err := b.backend.ReviewsByVendorID(uuid.UUID{})
		b.NoError(err)
		b.Len(reviews, 0)
	}
	{
		// Find review by vendor ID
		reviews, err := b.backend.ReviewsByVendorID(review.VendorID)
		b.NoError(err)
		b.Len(reviews, 1)

		b.Equal(review.Text, reviews[0].Text)
	}
}

func (b *BackendTestSuite) TestVendorsByCoordinateBounds() {
	vendor := &database.Vendor{
		ID:        uuid.MustParse("b1e2fbe3-3572-49d4-aad3-581f603ef357"),
		Latitude:  10,
		Longitude: 20,
	}

	{
		// Add vendor
		err := b.backend.VendorCreate(uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"), vendor)
		if !b.NoError(err) {
			b.FailNow("")
		}
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

func (b *BackendTestSuite) TestFavorite() {
	favorite := &database.Favorite{
		ID:       uuid.MustParse("09e8267b-027a-40dd-925c-d8111a87338a"),
		VendorID: uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		UserID:   uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
	}
	{
		// Favorite does not exist
		_, err := b.backend.Favorite(favorite.ID)
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		// Not authorized
		err := b.backend.FavoriteCreate(uuid.UUID{}, favorite)
		b.ErrorAs(err, &unauthorized)
	}
	{
		// Create favorite
		err := b.backend.FavoriteCreate(favorite.UserID, favorite)
		b.NoError(err)

		result, err := b.backend.Favorite(favorite.ID)
		b.NoError(err)
		b.Equal(favorite.ID, result.ID)
	}
}
