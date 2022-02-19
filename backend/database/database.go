package database

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"time"

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
	Owner           uuid.UUID
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
			Longitude,
			Owner
		) VALUES (
			:ID,
			:Name,
			:BusinessAddress,
			:Website,
			:BusinessHours,
			:Phone,
			:BusinessLogo,
			:Latitude,
			:Longitude,
			:Owner
	   )
	`
	_, err := d.db.NamedExec(command, vendor)
	return err
}
func (d *Database) Vendors() ([]Vendor, error) {
	const command = `
		SELECT * FROM Vendor
	`
	rows, err := d.db.Queryx(command)
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

func (d *Database) Vendor(id uuid.UUID) (*Vendor, error) {
	const command = `
		SELECT * FROM Vendor WHERE ID=?;
	`

	vendor := &Vendor{}
	err := d.db.QueryRowx(command, &id).StructScan(vendor)
	return vendor, err
}

func (d *Database) VendorUpdate(vendor *Vendor) error {
	const command = `
		UPDATE Vendor SET
			Name = :Name,
			BusinessAddress = :BusinessAddress,
			Website = :Website,
			BusinessHours = :BusinessHours,
			Phone = :Phone,
			BusinessLogo = :BusinessLogo,
			Latitude = :Latitude,
			Longitude = :Longitude,
			Owner = :Owner
		WHERE ID = :ID
	`
	_, err := d.db.NamedExec(command, &vendor)
	return err
}

type CoordinateBounds struct {
	NorthWestLat float64
	NorthWestLng float64
	SouthEastLat float64
	SouthEastLng float64
}

func (d *Database) VendorsByCoordinateBounds(bounds *CoordinateBounds) ([]Vendor, error) {
	// What if NW longitude is positive and SE longitude is negative?
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

func (d *Database) VendorByOwnerID(userID uuid.UUID) (*Vendor, error) {
	const command = `
		SELECT *
		FROM Vendor
		WHERE Owner = ?
	`

	vendor := &Vendor{}
	err := d.db.QueryRowx(command, &userID).StructScan(vendor)
	return vendor, err
}

type UserType int

const (
	// nolint: deadcode
	UserTypeCustomer UserType = iota
	// nolint: deadcode
	UserTypeVendor
)

type User struct {
	ID        uuid.UUID
	Username  string
	UserType  UserType
	Photo     uuid.UUID
	FirstName string
	LastName  string
}

// UserProtected contains User fields plus fields that are password-protected.
type UserProtected struct {
	*User
	Email      string
	SignUpDate time.Time
	GoogleID   *string
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
			Photo,
		  	GoogleID
		) VALUES (
			:ID,
			:Email,
			:Username,
			:FirstName,
			:LastName,
			:SignUpDate,
			:LoginPassword,
			:UserType,
			:Photo,
			:GoogleID
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
		SELECT
			ID,
			Email,
			Username,
			FirstName,
			LastName,
			SignUpDate,
			UserType,
			Photo,
			GoogleID
		FROM User
		WHERE ID=?
	`

	user := &UserProtected{}
	err := d.db.QueryRowx(command, &id).StructScan(user)
	return user, err
}

func (d *Database) UserUpdate(user *UserProtected) error {
	const command = `
		UPDATE User SET
			Email = :Email,
			Username = :Username,
			FirstName = :FirstName,
			LastName = :LastName,
			UserType = :UserType,
			Photo = :Photo,
			GoogleID = :GoogleID
		WHERE ID = :ID
	`
	_, err := d.db.NamedExec(command, &user)
	return err
}

type Credentials struct {
	Username string
	Password string
}

func (d *Database) UserIDByCredentials(credentials *Credentials) (uuid.UUID, error) {
	const command = `
		SELECT ID, LoginPassword
		FROM User
		WHERE Username=?
	`

	userID := uuid.UUID{}
	var passwordHash []byte
	err := d.db.QueryRowx(command, &credentials.Username).Scan(&userID, &passwordHash)
	if err != nil {
		return [16]byte{}, err
	}

	givenPasswordHash := sha256.Sum256([]byte(credentials.Password))

	if subtle.ConstantTimeCompare(givenPasswordHash[:], passwordHash) != 1 {
		return uuid.UUID{}, fmt.Errorf("password does not match")
	}

	return userID, nil
}

func (d *Database) UserIDByGoogleID(googleID string) (uuid.UUID, error) {
	const command = `
		SELECT ID
		FROM User
		WHERE GoogleID=?
	`

	userID := uuid.UUID{}
	err := d.db.QueryRowx(command, &googleID).Scan(&userID)
	return userID, err
}

type Review struct {
	ID             uuid.UUID
	Text           string
	VendorID       uuid.UUID
	UserID         uuid.UUID
	DatePosted     time.Time
	StarRating     *int
	ReplyTo        *uuid.UUID
	VendorFavorite *int
}

func (d *Database) ReviewCreate(review *Review) error {
	const command = `
		INSERT INTO Reviews (
			ID,
			Text,
			VendorID,
			UserID,
			DatePosted,
			StarRating,
			ReplyTo,
		    VendorFavorite
		) VALUES (
			:ID,
			:Text,
			:VendorID,
			:UserID,
			:DatePosted,
			:StarRating,
			:ReplyTo,
			:VendorFavorite
		)
	`
	_, err := d.db.NamedExec(command, review)
	return err
}

func (d *Database) Review(id uuid.UUID) (*Review, error) {
	const command = `
		SELECT * FROM Reviews WHERE ID=?
	`

	review := &Review{}
	err := d.db.QueryRowx(command, &id).StructScan(review)
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

type Photo struct {
	ID         uuid.UUID
	DatePosted time.Time
	Text       string
	LinkID     uuid.UUID
}

func (d *Database) PhotoCreate(photo *Photo) error {
	const command = `
		INSERT INTO Photos (
			ID,
			DatePosted,
			Text,
			LinkID
		) VALUES (
			:ID,
			:DatePosted,
			:Text,
			:LinkID
		)
	`
	_, err := d.db.NamedExec(command, photo)
	return err
}

func (d *Database) Photo(id uuid.UUID) (*Photo, error) {
	const command = `
		SELECT * FROM Photos WHERE ID=?
	`

	photo := &Photo{}
	err := d.db.QueryRowx(command, &id).StructScan(photo)

	return photo, err
}

func (d *Database) PhotosByLinkID(linkID uuid.UUID) ([]Photo, error) {
	const command = `
		SELECT * FROM Photos WHERE LinkID=?
	`

	rows, err := d.db.Queryx(command, linkID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Photo, 0)

	for rows.Next() {
		result = append(result, Photo{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

type Guide struct {
	ID            uuid.UUID
	Guide         string
	DatePosted    time.Time
	ArticleAuthor string
}

func (d *Database) GuideCreate(guide *Guide) error {
	const command = `
		INSERT INTO Guide (
			ID,
			Guide,
			DatePosted,
			ArticleAuthor
		) VALUES (
			:ID,
			:Guide,
			:DatePosted,
			:ArticleAuthor
		)
	`
	_, err := d.db.NamedExec(command, guide)
	return err
}

func (d *Database) Guide(id uuid.UUID) (*Guide, error) {
	const command = `
		SELECT * FROM Guide WHERE ID=?
	`

	guide := &Guide{}
	err := d.db.QueryRowx(command, &id).StructScan(guide)

	return guide, err
}

type Link struct {
	ID    uuid.UUID
	Title string
	URL   string
}

func (d *Database) LinkCreate(link *Link) error {
	const command = `
		INSERT INTO Link (
			ID,
			Title,
			url
		) VALUES (
			:ID,
			:Title,
			:URL
		)
	`
	_, err := d.db.NamedExec(command, link)
	return err
}

func (d *Database) Link(id uuid.UUID) (*Link, error) {
	const command = `
		SELECT * FROM Link WHERE ID=?
	`

	link := &Link{}
	err := d.db.QueryRowx(command, &id).StructScan(link)

	return link, err

}

//Create, Add Favorites
type Favorite struct {
	ID         uuid.UUID
	DatePosted time.Time
	VendorID   uuid.UUID
	UserID     uuid.UUID
}

func (d *Database) FavoriteCreate(favorite *Favorite) error {
	const command = `
		INSERT INTO Favorite (
			ID,
			DatePosted,
			VendorID,
			UserID
		) VALUES (
			:ID,
			:DatePosted,
			:VendorID,
			:UserID
		)
	`
	_, err := d.db.NamedExec(command, favorite)
	return err
}

func (d *Database) Favorite(id uuid.UUID) (*Favorite, error) {
	const command = `
		SELECT * FROM Favorite WHERE ID=?
	`

	favorite := &Favorite{}
	err := d.db.QueryRowx(command, &id).StructScan(favorite)
	return favorite, err
}
