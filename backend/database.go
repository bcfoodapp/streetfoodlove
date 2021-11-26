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
			Website VARCHAR(500) NULL,
			BusinessHours VARCHAR(500) NOT NULL,
			Phone VARCHAR(50) NULL,
			BusinessLogo BINARY(16) NOT NULL,
			Latitude FLOAT NOT NULL,
			Longitude FLOAT NOT NULL,
			PRIMARY KEY (ID)
		);

		`,
		`
		CREATE TABLE IF NOT EXISTS User (
			UserID BINARY(16) NOT NULL,
			Email VARCHAR(100) NULL,
			Username VARCHAR(100) NULL,
			FirstName VARCHAR(100) NULL,
			LastName VARCHAR(100) NULL,
			SignUpDate DATETIME NULL,
			LoginPassword BINARY(32) NULL,
			UserType TINYINT NULL,
			Photo BINARY(16),
			PRIMARY KEY (UserID)
		);
		`,
		`
		CREATE TABLE IF NOT EXISTS Reviews (
			ReviewID BINARY(16) NOT NULL,
			Text text(500) NULL,
			VendorID BINARY(16) NOT NULL,
			UserID BINARY(16) NOT NULL,
			DatePosted DATETIME NULL,
			PRIMARY KEY (ReviewID),
			FOREIGN KEY (VendorID) REFERENCES Vendor(ID)
			ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (UserID) REFERENCES User(UserID)
			ON DELETE CASCADE ON UPDATE CASCADE
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

	return d.VendorCreate(vendor1)
}

func (d *Database) AddUserData() error {
	count := 0
	if err := d.db.QueryRowx("SELECT COUNT(*) FROM User;").Scan(&count); err != nil {
		return err
	}

	if count > 0 {
		return nil
	}

	user0 := &User {
		UserID: uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
		Email: "seventan2516@gmail.com",
		Username: "Selina2516",
		FirstName: "Selina",
		LastName:  "Tan",
		SignUpDate: "2021-11-23 11:45",
		LoginPassword: "JINSIWDW234",
		UserType: 0,
		Photo: "image-1url",
	}

	if err := d.UserCreate(user0); err != nil {
		return err
	}

	user1 := &User {
		UserID: uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"),
		Email: "jonney2313@hotmail.com",
		Username: "Jonney2313",
		FirstName: "Jonney",
		LastName:  "William",
		SignUpDate: "2021-11-25 16:25",
		LoginPassword: "738djsuw*dwd",
		UserType: 0,
		Photo: "image-5url",
	}

	return d.UserCreate(user1)
}

func (d *Database) AddReviewData() error {
	count := 0
	if err := d.db.QueryRowx("SELECT COUNT(*) FROM Reviews;").Scan(&count); err != nil {
		return err
	}

	if count > 0 {
		return nil
	}

	review0 := &Review {
		ReviewID: uuid.MustParse("414569e0-8785-4131-8e13-43a9b7d8208d"),
		Text:   "The soup is super creamy and tasty and the chicken wings are so delicious",
		VendorID: uuid.MustParse("b924349d-442f-4fff-984e-ab0ec36f4590"),
		UserID:   uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"),
		DatePosted: "2021-11-26 09:34:00",
	}

	if err := d.ReviewCreate(review0); err != nil {
		return err
	}

	review1 := &Review {
		ReviewID: uuid.MustParse("398b174f-9e2f-4f7d-a179-bb86986227b5"),
		Text:   "The dumplings and ramen are supper delicious",
		VendorID: uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		UserID:   uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
		DatePosted: "2021-11-26 10:26:00",
	}

	return d.ReviewCreate(review1)
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

type User struct {
	UserID         uuid.UUID
	Email		   string
	Username       string
	FirstName      string
	LastName       string
	SignUpDate     string
	LoginPassword  string
	UserType       int
	Photo          string
}

type Review struct {
	ReviewID       uuid.UUID
	Text           string
	VendorID       uuid.UUID
	UserID         uuid.UUID
	DatePosted     string
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
	   );
	`
	_, err := d.db.NamedExec(command, &vendor)
	return err
}



func (d *Database) UserCreate(user *User) error {
	const command = `
		INSERT INTO User (
			UserID,
			Email,
			Username,
			FirstName,
			LastName,
			SignUpDate,
			LoginPassword,
			UserType,
			Photo
		) VALUES (
			:UserID,
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
	_, err := d.db.NamedExec(command, &user)
	return err
}

func (d *Database) User(id uuid.UUID) (*User, error) {
	const command = `
		SELECT * FROM User WHERE ID=?;
	`
	row := d.db.QueryRowx(command, &id)

	user := &User{}
	err := row.StructScan(user)
	return user, err
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

func (d *Database) Review(id uuid.UUID) (*Review, error) {
	const command = `
		SELECT * FROM Reviews WHERE ID=?;
	`
	row := d.db.QueryRowx(command, &id)

	review := &Review{}
	err := row.StructScan(review)
	return review, err
}

func (d *Database) ReviewCreate(review *Review) error {
	const command = `
		INSERT INTO Reviews (
			ReviewID,
			Text,
			VendorID,
			UserID,
			DatePosted
		) VALUES (
			:ReviewID,
			:Text,
			:VendorID,
			:UserID,
			:DatePosted
		)
	`
	_, err := d.db.NamedExec(command, &review)
	return err
}