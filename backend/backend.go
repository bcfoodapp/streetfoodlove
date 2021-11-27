package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
)

// Backend handles the application logic.
type Backend struct {
	*Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

const unauthorized = "unauthorized"

func (b *Backend) Vendor(id uuid.UUID) (*Vendor, error) {
	return b.Database.Vendor(id)
}

func (b *Backend) User(id uuid.UUID) (*User, error) {
	return b.Database.User(id)
}

func (b *Backend) Review(id uuid.UUID) (*Review, error) {
	return b.Database.Review(id)
}

func (b *Backend) ReviewPut(userID uuid.UUID, review *Review) error {
	if review.UserID != userID {
		return fmt.Errorf(unauthorized)
	}

	return b.Database.ReviewCreate(review)
}
