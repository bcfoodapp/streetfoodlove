package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"time"
)

// Backend handles the application logic.
// Any method that contains "userID uuid.UUID" as the first parameter means it is
// password-protected. This means that method should first check if that user has access rights
// before executing the command.
type Backend struct {
	Database *database.Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

var unauthorized = fmt.Errorf(
	"you are unauthorized to perform this action; make sure you are logged into the correct account",
)

func (b *Backend) Vendor(id uuid.UUID) (*database.Vendor, error) {
	return b.Database.Vendor(id)
}

func (b *Backend) VendorCreate(userID uuid.UUID, vendor *database.Vendor) error {
	// TODO A vendor user should only be able to create one vendor page.
	// We need a way to store a relationship from a user to a vendor page so that it is a 1-to-1
	// relationship.

	user, err := b.Database.User(userID)
	if err != nil {
		return err
	}

	if user.UserType != database.UserTypeVendor {
		return fmt.Errorf("you are not a vendor user type; only vendor users can create a vendor page")
	}

	return b.Database.VendorCreate(vendor)
}

func (b *Backend) User(id uuid.UUID) (*database.User, error) {
	userProtected, err := b.Database.User(id)
	if err != nil {
		return nil, err
	}
	return userProtected.User, nil
}

func (b *Backend) UserProtected(userID uuid.UUID, id uuid.UUID) (*database.UserProtected, error) {
	if userID != id {
		return nil, unauthorized
	}

	return b.Database.User(id)
}

func (b *Backend) UserProtectedUpdate(userID uuid.UUID, user *database.UserProtected) error {
	if userID != user.ID {
		return unauthorized
	}

	user.SignUpDate = time.Now()

	return b.Database.UserUpdate(user)
}

func (b *Backend) UserProtectedCreate(user *database.UserProtected, password string) error {
	user.SignUpDate = time.Now()

	return b.Database.UserCreate(user, password)
}

func (b *Backend) Review(id uuid.UUID) (*database.Review, error) {
	return b.Database.Review(id)
}

func (b *Backend) ReviewCreate(userID uuid.UUID, review *database.Review) error {
	if review.UserID != userID {
		return unauthorized
	}

	review.DatePosted = time.Now()

	return b.Database.ReviewCreate(review)
}

func (b *Backend) ReviewsByVendorID(vendorID uuid.UUID) ([]database.Review, error) {
	return b.Database.ReviewsByVendorID(vendorID)
}

func (b *Backend) VendorsByCoordinateBounds(bounds *database.CoordinateBounds) ([]uuid.UUID, error) {
	vendors, err := b.Database.VendorsByCoordinateBounds(bounds)
	if err != nil {
		return nil, err
	}

	result := make([]uuid.UUID, 0)
	for _, vendor := range vendors {
		result = append(result, vendor.ID)
	}
	return result, nil
}

func (b *Backend) Photo(id uuid.UUID) (*database.Photo, error) {
	return b.Database.Photo(id)
}

func (b *Backend) Guide(id uuid.UUID) (*database.Guide, error) {
	return b.Database.Guide(id)
}

func (b *Backend) Link(id uuid.UUID) (*database.Link, error) {
	return b.Database.Link(id)
}

//Favorite
func (b *Backend) Favorite(id uuid.UUID) (*database.Favorite, error) {
	return b.Database.Favorite(id)
}

func (b *Backend) FavoriteCreate(userID uuid.UUID, favorite *database.Favorite) error {
	if favorite.UserID != userID {
		return unauthorized
	}

	favorite.DatePosted = time.Now()

	return b.Database.FavoriteCreate(favorite)
}
