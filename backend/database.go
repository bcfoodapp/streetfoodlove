package main

import (
	"database/sql/driver"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Database struct {
	db *sqlx.DB
}

func NewDatabase(db *sqlx.DB) *Database {
	db.MapperFunc(func(s string) string { return s })
	return &Database{db}
}

func (d *Database) Close() error {
	return d.db.Close()
}

func (d *Database) SetupTables() error {
	const command = `
	CREATE TABLE IF NOT EXISTS Vendor (
		ID BINARY(16) NOT NULL,
		Name VARCHAR(100) NOT NULL,
		BusinessAddress VARCHAR(500) NULL,
		Phone VARCHAR(50) NULL,
		PRIMARY KEY (ID)
	);
	`
	_, err := d.db.Exec(command)
	return err
}

// AddTestData adds two vendors. This is only used for functionality testing.
func (d *Database) AddTestData() error {
	// Check that Vendors table is empty
	count := 0
	if err := d.db.QueryRowx("SELECT COUNT(*) FROM Vendor;").Scan(&count); err != nil {
		return err
	}

	if count > 0 {
		return nil
	}

	vendor0 := &Vendor{
		ID:              UUID(uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708")),
		BusinessAddress: "address0",
		Name:            "vendor0",
		Phone:           "123-123-1234",
	}

	if err := d.VendorCreate(vendor0); err != nil {
		return err
	}

	vendor1 := &Vendor{
		ID:              UUID(uuid.MustParse("b924349d-442f-4fff-984e-ab0ec36f4590")),
		BusinessAddress: "address1",
		Name:            "vendor1",
		Phone:           "321-321-4321",
	}

	return d.VendorCreate(vendor1)
}

type UUID uuid.UUID

func (u UUID) Value() (driver.Value, error) {
	return u[:], nil
}

func (u *UUID) Scan(src interface{}) error {
	return (*uuid.UUID)(u).Scan(src)
}

type Vendor struct {
	ID              UUID
	BusinessAddress string
	Name            string
	Phone           string
}

func (d *Database) VendorCreate(vendor *Vendor) error {
	const command = `
		INSERT INTO Vendor(
			ID,
			Name,
			BusinessAddress,
			Phone
	   ) VALUES (
			:ID,
	    	:BusinessAddress,
			:Name,
			:Phone
	   );
	`
	_, err := d.db.NamedExec(command, &vendor)
	return err
}

func (d *Database) Vendor(id UUID) (*Vendor, error) {
	const command = `
		SELECT * FROM Vendor WHERE ID=?;
	`
	row := d.db.QueryRowx(command, &id)

	vendor := &Vendor{}
	err := row.StructScan(vendor)
	return vendor, err
}
