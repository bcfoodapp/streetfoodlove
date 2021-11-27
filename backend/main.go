package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"net/http"
	"time"
)

func main() {
	database := getDatabase()
	if err := database.SetupTables(); err != nil {
		panic(err)
	}
	if err := database.AddTestData(); err != nil {
		panic(err)
	}

	api := API{&Backend{database}}
	defer api.Close()

	router := gin.Default()
	api.AddRoutes(router)

	server := http.Server{
		Addr:         ":8080",
		Handler:      router,
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}
	defer server.Close()

	fmt.Println("serving at localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		panic(err)
	}
}

// getDatabase creates database and returns the database connection.
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
		ParseTime:            true,
	}
	db, err = sqlx.Connect("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}
	return NewDatabase(db)
}
