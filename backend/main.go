package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"os"
	"time"
)

func main() {
	var config *database.Configuration

	secretsFile, isProduction := os.LookupEnv("SECRETS_FILE")
	if isProduction {
		config = database.Production(secretsFile)
	} else {
		config = database.Development()
	}

	db, err := sqlx.Connect("mysql", config.MySQLConfig.FormatDSN())
	if err != nil {
		panic(err)
	}

	db.SetConnMaxLifetime(time.Minute * 4)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	api := API{&Backend{database.NewDatabase(db)}}
	defer func() {
		if err := api.Close(); err != nil {
			panic(err)
		}
	}()

	router := gin.Default()
	api.AddRoutes(router)

	config.Server.Handler = router

	defer func() {
		if err := config.Server.Close(); err != nil {
			panic(err)
		}
	}()

	fmt.Println("serving at localhost:8080")

	if err := config.Server.ListenAndServe(); err != nil {
		panic(err)
	}
}
