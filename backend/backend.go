package main

import "github.com/bcfoodapp/streetfoodlove/uuid"

type Backend struct {
	*Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

func (b *Backend) Vendor(id uuid.UUID) (*Vendor, error) {
	return b.Database.Vendor(id)
}
