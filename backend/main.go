package main

import (
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func main() {
	database := getDatabase()
	if err := database.SetupTables(); err != nil {
		panic(err)
	}
	if err := database.AddTestData(); err != nil {
		panic(err)
	}
	backend := Backend{database}
	defer backend.Close()
}

func getDatabase() *Database {
	config := mysql.Config{
		User:                 "root",
		AllowNativePasswords: true,
	}
	db, err := sqlx.Connect("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}

	commands := [...]string{
		`
		CREATE DATABASE IF NOT EXISTS streetfoodlove
		CHARACTER SET utf8mb4
		COLLATE utf8mb4_unicode_ci;
		`,
		`USE streetfoodlove;`,
	}

	for _, command := range commands {
		_, err := db.Exec(command)
		if err != nil {
			panic(err)
		}
	}

	db.Close()

	config = mysql.Config{
		User:                 "root",
		AllowNativePasswords: true,
		DBName:               "streetfoodlove",
	}
	db, err = sqlx.Connect("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}
	return NewDatabase(db)
}
