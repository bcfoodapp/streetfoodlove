// Resets local database state.
package main

import (
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
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
		defer db.Close()

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
