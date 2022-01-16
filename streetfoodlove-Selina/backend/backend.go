package main

import "github.com/bcfoodapp/streetfoodlove/uuid"

// Backend handles the application logic.
type Backend struct {
	*Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

func (b *Backend) Vendor(id uuid.UUID) (*Vendor, error) {
	return b.Database.Vendor(id)
}

func (b *Backend) User(id uuid.UUID) (*User, error) {
	return b.Database.User(id)
}