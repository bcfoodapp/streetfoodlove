package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"time"
)

// Backend handles the application logic.
// Any method that contains "userID uuid.UUID" as the first parameter means it is
// password-protected. This means that method should first check if that user has access rights
// before executing the command.
type Backend struct {
	Database *Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

const unauthorized = "unauthorized"

func (b *Backend) Vendor(id uuid.UUID) (*Vendor, error) {
	return b.Database.Vendor(id)
}

func (b *Backend) User(id uuid.UUID) (*User, error) {
	userProtected, err := b.Database.User(id)
	if err != nil {
		return nil, err
	}
	return userProtected.User, nil
}

func (b *Backend) UserProtected(userID uuid.UUID, id uuid.UUID) (*UserProtected, error) {
	if userID != id {
		return nil, fmt.Errorf(unauthorized)
	}

	return b.Database.User(id)
}

func (b *Backend) Review(id uuid.UUID) (*Review, error) {
	return b.Database.Review(id)
}

func (b *Backend) ReviewPut(userID uuid.UUID, review *Review) error {
	if review.UserID != userID {
		return fmt.Errorf(unauthorized)
	}

	review.DatePosted = time.Now()

	return b.Database.ReviewCreate(review)
}

func (b *Backend) ReviewsByVendorID(vendorID uuid.UUID) ([]*Review, error) {
	return b.Database.ReviewsByVendorID(vendorID)
}
