package database

import (
	"crypto/sha256"
	"crypto/subtle"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/bcfoodapp/streetfoodlove/uuid"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func ResetDatabase(db *sqlx.DB) error {
	commands := [...]string{
		"DROP DATABASE IF EXISTS streetfoodlove",
		`
			CREATE DATABASE IF NOT EXISTS streetfoodlove
			CHARACTER SET utf8mb4
			COLLATE utf8mb4_unicode_ci
			`,
	}

	for _, command := range commands {
		if _, err := db.Exec(command); err != nil {
			panic(err)
		}
	}
	return nil
}

func SetupTables(db *sqlx.DB) error {
	commands := [...]string{
		`
		CREATE TABLE User (
			ID CHAR(36) NOT NULL,
			Email VARCHAR(100) NULL,
			Username VARCHAR(100) UNIQUE NULL,
			FirstName VARCHAR(100) NULL,
			LastName VARCHAR(100) NULL,
			SignUpDate DATETIME NULL,
			LoginPassword BINARY(32) NULL,
			UserType TINYINT NULL,
			Photo VARCHAR(50) NOT NULL,
			GoogleID VARCHAR(50) UNIQUE NULL,
			LastReviewSeen CHAR(36) NULL,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE Vendor (
			ID CHAR(36) NOT NULL,
			Name VARCHAR(100) NOT NULL,
			BusinessAddress VARCHAR(500) NULL,
			Website VARCHAR(500) NULL,
			BusinessHours VARCHAR(500) NOT NULL,
			Phone VARCHAR(50) NULL,
			BusinessLogo VARCHAR(50) NULL,
			Latitude FLOAT NOT NULL,
			Longitude FLOAT NOT NULL,
			Description VARCHAR(1500) NULL,
			SocialMediaLink VARCHAR(500) NULL,
			Owner CHAR(36) NOT NULL,
			PRIMARY KEY (ID),
			FOREIGN KEY (Owner) REFERENCES User(ID)
			ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		CREATE TABLE Reviews (
			ID CHAR(36) NOT NULL,
			Text text(500) NULL,
			VendorID CHAR(36) NOT NULL,
			UserID CHAR(36) NOT NULL,
			DatePosted DATETIME NULL,
			StarRating TINYINT NULL,
			ReplyTo CHAR(36) NULL,
			VendorFavorite TINYINT,
			PRIMARY KEY (ID),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID)
			ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (UserID) REFERENCES User(ID)
			ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY(ReplyTo) REFERENCES Reviews(ID)
			ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		CREATE TABLE Photos (
			ID VARCHAR(50) NOT NULL,
			DatePosted DATETIME NOT NULL,
			Text VARCHAR(500) NOT NULL,
			LinkID CHAR(36) NOT NULL,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE Guide (
			ID CHAR(36) NOT NULL,
			Guide VARCHAR(5000) NOT NULL,
			DatePosted DATETIME NOT NULL,
			ArticleAuthor VARCHAR(500) NOT NULL,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE Link (
			ID CHAR(36) NOT NULL,
			Title VARCHAR(45) NOT NULL,
			URL VARCHAR(255) NULL,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE Favorite (
			ID CHAR(36) NOT NULL,
			DatePosted DATETIME NULL,
			VendorID CHAR(36),
			UserID CHAR(36),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			PRIMARY KEY (ID)
		)
		`,
		`
		CREATE TABLE Stars (
			UserID CHAR(36) NOT NULL,
			VendorID CHAR(36) NOT NULL,
			PRIMARY KEY (UserID, VendorID),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		CREATE TABLE Areas (
			VendorID CHAR(36) NOT NULL,
			AreaName VARCHAR(45) NOT NULL, 
			PRIMARY KEY (VendorID, AreaName),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID) ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		CREATE TABLE CuisineTypes (
			ID  CHAR(36) NOT NULL,
			VendorID CHAR(36) NOT NULL,
			CuisineType VARCHAR(45) NOT NULL, 
			PRIMARY KEY (ID),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID) ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		CREATE TABLE Queries (
			ID CHAR(36) NOT NULL,
			UserID CHAR(36) NOT NULL,
			QueryText VARCHAR(200) NULL,
			DateRequested DATETIME NULL,
			PRIMARY KEY (ID),
			FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE
		)
		`,
		`
		ALTER TABLE User
			ADD FOREIGN KEY (LastReviewSeen) REFERENCES Reviews(ID)
			ON DELETE SET NULL ON UPDATE CASCADE
		`,
	}

	for _, command := range commands {
		_, err := db.Exec(command)
		if err != nil {
			return err
		}
	}
	return nil
}

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
	BusinessLogo    *string
	Latitude        float64
	Longitude       float64
	Description     string
	SocialMediaLink string
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
			Description,
			SocialMediaLink,
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
			:Description,
			:SocialMediaLink,
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
			Owner = :Owner,
			Description = :Description,
			SocialMediaLink = :SocialMediaLink
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
	UserTypeCustomer UserType = iota
	UserTypeVendor
)

type User struct {
	ID        uuid.UUID
	Username  string
	UserType  UserType
	Photo     string
	FirstName string
	LastName  string
}

// UserProtected contains User fields plus fields that are password-protected.
type UserProtected struct {
	*User
	Email          string
	SignUpDate     time.Time
	GoogleID       *string
	LastReviewSeen *uuid.UUID
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
			GoogleID,
			LastReviewSeen
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
			GoogleID = :GoogleID,
			LastReviewSeen = :LastReviewSeen
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
	VendorFavorite bool
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

func (d *Database) ReviewUpdate(review *Review) error {
	const command = `
		UPDATE Reviews SET
			Text = :Text,
			VendorID = :VendorID,
			UserID = :UserID,
			DatePosted = :DatePosted,
			StarRating = :StarRating,
			ReplyTo = :ReplyTo,
			VendorFavorite = :VendorFavorite
		WHERE ID = :ID
	`
	_, err := d.db.NamedExec(command, &review)
	return err
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

//query to find out if the vendor has been starred, it returns true if it is false if not
func (d *Database) StarredVendorFavorite(ReviewID uuid.UUID, VendorID uuid.UUID) (bool, error) {
	var starred bool
	const command = `
		SELECT *
		FROM Reviews
		WHERE ID=?
		AND VendorID = ?
	`
	//if err := d.db.Queryx("SELECT * FROM Reviews WHERE ID = ? AND VendorID = ?"
	//return false, err
	//fmt.Errorf("starredVendorFavorite %d: ", ReviewsID)
	rows, err := d.db.Queryx(command, &ReviewID, &VendorID)
	if err != nil {
		return false, err
	}
	defer rows.Close()
	result := make([]Review, 0)
	for rows.Next() {
		result = append(result, Review{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return false, err
		}
	}
	return starred, nil
}

func (d *Database) VendorStarredByUser(UserID uuid.UUID) ([]Vendor, error) {
	const command = `
		SELECT * FROM Reviews WHERE UserID=?
`
	rows, err := d.db.Queryx(command, UserID)
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

type Photo struct {
	ID         string
	DatePosted time.Time
	Text       string
	// LinkID references either a Vendor or Review.
	LinkID uuid.UUID
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

// GetOwnerOfLink returns the owner of the referenced record. For example, if linkID references a
// Vendor, the Owner field of that vendor is returned.
func (d *Database) GetOwnerOfLink(linkID uuid.UUID) (uuid.UUID, error) {
	vendor, err := d.Vendor(linkID)
	if err == nil {
		return vendor.Owner, nil
	}

	// err should be ErrNoRows at this point
	if !errors.Is(err, sql.ErrNoRows) {
		return uuid.UUID{}, err
	}

	review, err := d.Review(linkID)
	if err != nil {
		return uuid.UUID{}, err
	}

	return review.UserID, nil
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
		SELECT * FROM Favorite WHERE VendorID=?
	`

	favorite := &Favorite{}
	err := d.db.QueryRowx(command, &id).StructScan(favorite)
	return favorite, err

}
func (d *Database) FavoritebyVendor(favoriteID uuid.UUID) ([]Favorite, error) {
	rows, err := d.db.Queryx("SELECT * FROM Favorite WHERE ID = ?", favoriteID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	//to hold data that favorite a vendor
	var fav []Favorite

	//go through rows to assign column to struct field
	for rows.Next() {
		var favs Favorite
		if err := rows.StructScan(&favs); err != nil {
			return fav, err
		}
		fav = append(fav, favs)
	}
	if err = rows.Err(); err != nil {
		return fav, err
	}
	return fav, nil
}

type Star struct {
	UserID   uuid.UUID
	VendorID uuid.UUID
}

func (d *Database) StarCreate(star *Star) error {
	const command = `
		INSERT INTO Stars (
			UserID,
			VendorID
		) VALUES (
			:UserID,
			:VendorID
		)
	`

	_, err := d.db.NamedExec(command, star)
	return err
}

func (d *Database) StarsByUserID(userID uuid.UUID) ([]Star, error) {
	const command = `
		SELECT * FROM Stars WHERE UserID=?
	`

	rows, err := d.db.Queryx(command, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Star, 0)

	for rows.Next() {
		result = append(result, Star{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

func (d *Database) Star(userID uuid.UUID, vendorID uuid.UUID) (*Star, error) {
	const command = `
		SELECT * FROM Stars WHERE UserID=? AND VendorID=?
	`

	star := &Star{}
	err := d.db.QueryRowx(command, &userID, &vendorID).StructScan(star)
	return star, err
}

func (d *Database) CountVendorStars(vendorID uuid.UUID) (int, error) {
	const command = `
		SELECT count(*) FROM Stars WHERE VendorID=?
	`

	result := 0
	err := d.db.QueryRowx(command, &vendorID).Scan(&result)
	return result, err
}

func (d *Database) StarDelete(userID uuid.UUID, vendorID uuid.UUID) error {
	const command = `
		DELETE FROM Stars WHERE UserID=? AND VendorID=?
	`

	_, err := d.db.Exec(command, &userID, &vendorID)
	return err
}

type Areas struct {
	VendorID uuid.UUID
	AreaName string
}

func (d *Database) AreasCreate(area *Areas) error {
	const command = `
		INSERT INTO Areas (
			VendorID,
			AreaName
		) VALUES (
			:VendorID,
			:AreaName
		)
	`
	_, err := d.db.NamedExec(command, area)
	return err
}

func (d *Database) AreasByVendorID(vendorID uuid.UUID) ([]Areas, error) {
	const command = `
		SELECT *
		FROM Areas
		WHERE VendorID=?
	`
	rows, err := d.db.Queryx(command, vendorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Areas, 0)

	for rows.Next() {
		result = append(result, Areas{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

func (d *Database) Area(vendorID uuid.UUID, areaName string) (*Areas, error) {
	const command = `
		SELECT * FROM Areas WHERE VendorID=? AND AreaName=?
	`

	Area := &Areas{}
	err := d.db.QueryRowx(command, &vendorID, &areaName).StructScan(Area)
	return Area, err
}

type CuisineTypes struct {
	ID          uuid.UUID
	VendorID    uuid.UUID
	CuisineType string
}

func (d *Database) CuisineTypesCreate(cuisineType *CuisineTypes) error {
	const command = `
		INSERT INTO CuisineTypes (
			ID,
			VendorID,
			CuisineType
		) VALUES (
			:ID,
			:VendorID,
			:CuisineType
		)
	`
	_, err := d.db.NamedExec(command, cuisineType)
	return err
}

func (d *Database) CuisineTypeByVendorID(vendorID uuid.UUID) ([]CuisineTypes, error) {
	const command = `
		SELECT *
		FROM CuisineTypes
		WHERE VendorID=?
	`
	rows, err := d.db.Queryx(command, vendorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]CuisineTypes, 0)

	for rows.Next() {
		result = append(result, CuisineTypes{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

func (d *Database) CuisineType(ID uuid.UUID) (*CuisineTypes, error) {
	const command = `
		SELECT * FROM CuisineTypes WHERE VendorID=? AND CuisineType=?
	`

	CuisineType := &CuisineTypes{}
	err := d.db.QueryRowx(command, &ID).StructScan(CuisineType)
	return CuisineType, err
}

type Query struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	QueryText     string
	DateRequested time.Time
}

func (d *Database) QueryCreate(Query *Query) error {
	const command = `
		INSERT INTO Queries (
			ID,
			UserID,
			QueryText,
			DateRequested
		) VALUES (
			:ID,
			:UserID,
			:QueryText,
			:DateRequested
		)
	`

	_, err := d.db.NamedExec(command, Query)
	return err
}

func (d *Database) Query(id uuid.UUID) (*Query, error) {
	const command = `
		SELECT * FROM Queries WHERE ID=?
	`

	query := &Query{}
	err := d.db.QueryRowx(command, &id).StructScan(query)
	return query, err
}

func (d *Database) QueryByUserID(userID uuid.UUID) ([]Query, error) {
	const command = `
		SELECT * FROM Queries WHERE UserID=?
	`

	rows, err := d.db.Queryx(command, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Query, 0)

	for rows.Next() {
		result = append(result, Query{})
		if err := rows.StructScan(&result[len(result)-1]); err != nil {
			return nil, err
		}
	}

	return result, rows.Err()
}

func (d *Database) CountMostFrequentQueries(userID uuid.UUID) (int, error) {
	const command = `
		SELECT count(*) FROM Queries WHERE UserID=? QueryText = ?
		ORDER BY DateRequested DESC
	`
	result := 0
	err := d.db.QueryRowx(command, &userID).Scan(&result)
	return result, err
}





