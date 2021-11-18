package main

import (
	"github.com/bcfoodapp/streetfoodlove/uuid"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

// Database abstraction layer
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

// SetupTables creates necessary tables if they do not exist.
func (d *Database) SetupTables() error {
	commands := [...]string{
		`
		CREATE TABLE IF NOT EXISTS Vendor (
			ID BINARY(16) NOT NULL,
			Name VARCHAR(100) NOT NULL,
			BusinessAddress VARCHAR(500) NULL,
			Phone VARCHAR(50) NULL,
			PRIMARY KEY (ID)
		);
		`,
	}
	for _, command := range commands {
		_, err := d.db.Exec(command)
		if err != nil {
			return err
		}
	}
	return nil
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
		ID:              uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		BusinessAddress: "address0",
		Name:            "vendor0",
		Phone:           "123-123-1234",
	}

	if err := d.VendorCreate(vendor0); err != nil {
		return err
	}

	vendor1 := &Vendor{
		ID:              uuid.MustParse("b924349d-442f-4fff-984e-ab0ec36f4590"),
		BusinessAddress: "address1",
		Name:            "vendor1",
		Phone:           "321-321-4321",
	}

	return d.VendorCreate(vendor1)
}

type Vendor struct {
	ID              uuid.UUID
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
			:Name,
	    	:BusinessAddress,
			:Phone
	   );
	`
	_, err := d.db.NamedExec(command, &vendor)
	return err
}

func (d *Database) Vendor(id uuid.UUID) (*Vendor, error) {
	const command = `
		SELECT * FROM Vendor WHERE ID=?;
	`
	row := d.db.QueryRowx(command, &id)

	vendor := &Vendor{}
	err := row.StructScan(vendor)
	return vendor, err
}
