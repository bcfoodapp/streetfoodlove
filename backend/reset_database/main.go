// Resets local database state.
package main

import (
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"time"
)

func main() {
	func() {
		config := mysql.Config{
			User:                 "root",
			AllowNativePasswords: true,
		}
		db, err := sqlx.Connect("mysql", config.FormatDSN())
		if err != nil {
			panic(err)
		}
		defer func() {
			if err := db.Close(); err != nil {
				panic(err)
			}
		}()

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
	}()

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

	if err := SetupTables(db); err != nil {
		panic(err)
	}

	if err := addTestData(database.NewDatabase(db)); err != nil {
		panic(err)
	}
}

func SetupTables(db *sqlx.DB) error {
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
		_, err := db.Exec(command)
		if err != nil {
			return err
		}
	}
	return nil
}

func addTestData(db *database.Database) error {
	users := []database.UserProtected{
		{
			User: &database.User{
				ID:       uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
				Username: "test",
				UserType: database.UserTypeCustomer,
				Photo:    uuid.MustParse("e2f045ce-e378-4971-bc3f-e98ce193fc48"),
			},
			Email:      "seventan2516@gmail.com",
			FirstName:  "Selina",
			LastName:   "Tan",
			SignUpDate: time.Date(2021, 11, 23, 11, 45, 0, 0, time.UTC),
		},
		{
			User: &database.User{
				ID:       uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"),
				Username: "Jonney2313",
				UserType: database.UserTypeCustomer,
				Photo:    uuid.MustParse("d523ac1b-3036-4f4e-a275-3f0a9fd8a733"),
			},
			Email:     "jonney2313@hotmail.com",
			FirstName: "Jonney",
			LastName:  "William",
		},
	}

	for _, user := range users {
		if err := db.UserCreate(&user, "password"); err != nil {
			return err
		}
	}

	vendors := []database.Vendor{
		{
			ID:              uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			Name:            "vendor0",
			BusinessAddress: "address0",
			Website:         "www.vendor0.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "123-123-1234",
			BusinessLogo:    "image0_url",
			Latitude:        47.608013,
			Longitude:       -122.335161,
		},
		{
			ID:              uuid.MustParse("b924349d-442f-4fff-984e-ab0ec36f4590"),
			Name:            "vendor1",
			BusinessAddress: "address1",
			Website:         "www.vendor1.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "321-321-4321",
			BusinessLogo:    "Image1_url",
			Latitude:        47.982567,
			Longitude:       -122.193375,
		},
	}

	for _, vendor := range vendors {
		if err := db.VendorCreate(&vendor); err != nil {
			return err
		}
	}

	return nil
}
