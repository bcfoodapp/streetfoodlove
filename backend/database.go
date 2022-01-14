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

type Vendor struct {
	ID              uuid.UUID
	Name            string
	BusinessAddress string
	Website         string
	BusinessHours   string
	Phone           string
	BusinessLogo    string
	Latitude        float64
	Longitude       float64
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

type CoordinateBounds struct {
	NorthWestLat float64
	NorthWestLng float64
	SouthEastLat float64
	SouthEastLng float64
}

func (d *Database) VendorsByCoordinateBounds(bounds *CoordinateBounds) ([]Vendor, error) {
	const command = `
		SELECT *
		FROM Vendor
		WHERE Latitude BETWEEN :SouthEastLat AND :NorthWestLat
			AND Longitude BETWEEN :NorthWestLng AND :SouthEastLng
	`

	rows, err := d.db.NamedQuery(command, bounds)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Vendor, 0)

	for rows.Next() {
		result = append(result, Vendor{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

type UserType int

const (
	// nolint: deadcode
	UserTypeCustomer UserType = iota
	// nolint: deadcode
	UserTypeVendor
)

type User struct {
	ID       uuid.UUID
	Username string
	UserType UserType
	Photo    uuid.UUID
}

// UserProtected contains User fields plus fields that are password-protected.
type UserProtected struct {
	*User
	Email      string
	FirstName  string
	LastName   string
	SignUpDate time.Time
}

func (d *Database) UserCreate(user *UserProtected, password string) error {
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
		*UserProtected
		LoginPassword []byte
	}{
		user, hash[:],
	}
	_, err := d.db.NamedExec(command, userWithPassword)
	return err
}

func (d *Database) User(id uuid.UUID) (*UserProtected, error) {
	const command = `
		SELECT * FROM User WHERE ID=?
	`
	row := d.db.QueryRowx(command, &id)

	user := &UserProtected{}
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

func (d *Database) ReviewsByVendorID(vendorID uuid.UUID) ([]Review, error) {
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
	defer rows.Close()

	result := make([]Review, 0)

	for rows.Next() {
		result = append(result, Review{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}
