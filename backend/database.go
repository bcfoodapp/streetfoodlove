package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"time"
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
			Website VARCHAR(500) NULL,
			BusinessHours VARCHAR(500) NOT NULL,
			Phone VARCHAR(50) NULL,
			BusinessLogo BINARY(16) NOT NULL,
			Latitude FLOAT NOT NULL,
			Longitude FLOAT NOT NULL,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE IF NOT EXISTS User (
			ID BINARY(16) NOT NULL,
			Email VARCHAR(100) NULL,
			Username VARCHAR(100) UNIQUE NULL,
			FirstName VARCHAR(100) NULL,
			LastName VARCHAR(100) NULL,
			SignUpDate DATETIME NULL,
			LoginPassword BINARY(32) NULL,
			UserType TINYINT NULL,
			Photo BINARY(16),
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE IF NOT EXISTS Reviews (
			ID BINARY(16) NOT NULL,
			Text text(500) NULL,
			VendorID BINARY(16) NOT NULL,
			UserID BINARY(16) NOT NULL,
			DatePosted DATETIME NULL,
			PRIMARY KEY (ID),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID)
			ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (UserID) REFERENCES User(ID)
			ON DELETE CASCADE ON UPDATE CASCADE
		)
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

// AddTestData adds test data. This is only for testing purposes.
func (d *Database) AddTestData() error {
	// Check if Vendors data exists
	vendorCount := 0
	if err := d.db.QueryRowx("SELECT COUNT(*) FROM Vendor;").Scan(&vendorCount); err != nil {
		return err
	}

	if vendorCount < 2 {
		vendor0 := &Vendor{
			ID:              uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			Name:            "vendor0",
			BusinessAddress: "address0",
			Website:         "www.vendor0.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "123-123-1234",
			BusinessLogo:    "image0_url",
			Latitude:        "47.608013",
			Longitude:       "-122.335167",
		}

		if err := d.VendorCreate(vendor0); err != nil {
			return err
		}

		vendor1 := &Vendor{
			ID:              uuid.MustParse("b924349d-442f-4fff-984e-ab0ec36f4590"),
			Name:            "vendor1",
			BusinessAddress: "address1",
			Website:         "www.vendor1.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "321-321-4321",
			BusinessLogo:    "Image1_url",
			Latitude:        "47.982567",
			Longitude:       "-122.193375",
		}

		if err := d.VendorCreate(vendor1); err != nil {
			return err
		}
	}

	userCount := 0
	if err := d.db.QueryRowx("SELECT COUNT(*) FROM User;").Scan(&userCount); err != nil {
		return err
	}

	if userCount < 1 {
		user0 := &User{
			ID:         uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
			Email:      "test@example.com",
			Username:   "test",
			FirstName:  "Selina",
			LastName:   "Tan",
			SignUpDate: time.Now(),
			UserType:   0,
			Photo:      "image-1url",
		}

		if err := d.UserCreate(user0, "password"); err != nil {
			return err
		}
	}

	return nil
}

type Vendor struct {
	ID              uuid.UUID
	Name            string
	BusinessAddress string
	Website         string
	BusinessHours   string
	Phone           string
	BusinessLogo    string
	Latitude        string
	Longitude       string
}

func (d *Database) VendorCreate(vendor *Vendor) error {
	const command = `
		INSERT INTO Vendor(
			ID,
			Name,
			BusinessAddress,
			Website,
			BusinessHours,
			Phone,
			BusinessLogo,
			Latitude,
			Longitude

	   ) VALUES (
			:ID,
			:Name,
	    	:BusinessAddress,
			:Website,
			:BusinessHours,
			:Phone,
			:BusinessLogo,
			:Latitude,
			:Longitude
	   )
	`
	_, err := d.db.NamedExec(command, vendor)
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

type User struct {
	ID         uuid.UUID
	Email      string
	Username   string
	FirstName  string
	LastName   string
	SignUpDate time.Time
	UserType   int
	Photo      string
}

func (d *Database) UserCreate(user *User, password string) error {
	const command = `
		INSERT INTO User (
			ID,
			Email,
			Username,
			FirstName,
			LastName,
			SignUpDate,
			LoginPassword,
			UserType,
			Photo
		) VALUES (
			:ID,
			:Email,
			:Username,
			:FirstName,
			:LastName,
			:SignUpDate,
			:LoginPassword,
			:UserType,
			:Photo
		)
	`
	hash := sha256.Sum256([]byte(password))
	userWithPassword := &struct {
		*User
		LoginPassword []byte
	}{
		user, hash[:],
	}
	_, err := d.db.NamedExec(command, userWithPassword)
	return err
}

func (d *Database) User(id uuid.UUID) (*User, error) {
	const command = `
		SELECT * FROM User WHERE ID=?
	`
	row := d.db.QueryRowx(command, &id)

	user := &User{}
	err := row.StructScan(user)
	return user, err
}

type Credentials struct {
	Username string
	Password string
}

func (d *Database) UserIDByCredentials(credentials *Credentials) (uuid.UUID, error) {
	const command = `
		SELECT ID, LoginPassword FROM User WHERE Username=?
	`
	row := d.db.QueryRowx(command, &credentials.Username)

	userID := uuid.UUID{}
	var passwordHash []byte
	err := row.Scan(&userID, &passwordHash)
	if err != nil {
		return [16]byte{}, err
	}

	givenPasswordHash := sha256.Sum256([]byte(credentials.Password))

	if subtle.ConstantTimeCompare(givenPasswordHash[:], passwordHash) != 1 {
		return uuid.UUID{}, fmt.Errorf("password does not match")
	}

	return userID, nil
}

type Review struct {
	ID         uuid.UUID
	Text       string
	VendorID   uuid.UUID
	UserID     uuid.UUID
	DatePosted time.Time
}

func (d *Database) ReviewCreate(review *Review) error {
	const command = `
		INSERT INTO Reviews (
			ID,
			Text,
			VendorID,
			UserID,
			DatePosted
		) VALUES (
			:ID,
			:Text,
			:VendorID,
			:UserID,
			:DatePosted
		)
	`
	_, err := d.db.NamedExec(command, review)
	return err
}

func (d *Database) Review(id uuid.UUID) (*Review, error) {
	const command = `
		SELECT * FROM Reviews WHERE ID=?
	`
	row := d.db.QueryRowx(command, &id)

	review := &Review{}
	err := row.StructScan(review)
	return review, err
}

func (d *Database) ReviewsByVendorID(vendorID uuid.UUID) ([]*Review, error) {
	const command = `
		SELECT *
		FROM Reviews
		WHERE VendorID=?
		ORDER BY DatePosted DESC
	`
	rows, err := d.db.Queryx(command, vendorID)
	if err != nil {
		return nil, err
	}

	var result []*Review

	for rows.Next() {
		review := &Review{}
		if err := rows.StructScan(review); err != nil {
			return nil, err
		}
		result = append(result, review)
	}

	return result, rows.Err()
}
