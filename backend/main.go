package main

import (
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func main() {
	config := mysql.Config{User: "root", AllowNativePasswords: true}

	db, err := sqlx.Connect("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}
	createDatabase(db)

	database := NewDatabase(db)
	if err := database.SetupTables(); err != nil {
		panic(err)
	}
	if err := database.AddTestData(); err != nil {
		panic(err)
	}
	//_ := Backend{database}
}

func createDatabase(db *sqlx.DB) {
	commands := [...]string{
		`
		CREATE DATABASE IF NOT EXISTS streetfoodlove
		CHARACTER SET utf8mb4
		COLLATE utf8mb4_unicode_ci;
		`,
		"USE streetfoodlove;",
	}

	for _, command := range commands {
		_, err := db.Exec(command)
		if err != nil {
			panic(err)
		}
	}
}
