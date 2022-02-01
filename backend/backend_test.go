// Integration tests for backend functions.

package main

import (
	"database/sql"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/suite"
	"testing"
)

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
	db, err := sqlx.Connect("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}

	backend := &Backend{Database: database.NewDatabase(db)}
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

func (b *BackendTestSuite) TestVendor() {
	vendor := &database.Vendor{
		ID:   uuid.MustParse("25aa0170-2746-424b-8f22-4c27ea528402"),
		Name: "new vendor",
	}
	{
		_, err := b.backend.Vendor(vendor.ID)
		b.ErrorAs(err, &sql.ErrNoRows)
	}
	{
		err := b.backend.VendorCreate(uuid.UUID{}, vendor)
		b.Error(err)
	}
	{
		notVendor := uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4")
		err := b.backend.VendorCreate(notVendor, vendor)
		b.Error(err)
	}
	{
		vendorUser := uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a")
		err := b.backend.VendorCreate(vendorUser, vendor)
		b.NoError(err)
	}
	{
		result, err := b.backend.Vendor(vendor.ID)
		b.NoError(err)
		b.Equal(vendor, result)
	}
}
