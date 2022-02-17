package main

import (
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"log"
	"os"
	"time"
)

func main() {
	var config *database.Configuration

	secretsFile, isProduction := os.LookupEnv("SECRETS_FILE")
	if isProduction {
		log.Println("using production configuration")
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

	aws, err := NewAWS()
	if err != nil {
		if isProduction {
			panic(err)
		} else {
			log.Println("AWS credentials could not be loaded. AWS functions are disabled.")
		}
	}

	api := API{&Backend{
		AWS:      aws,
		Database: database.NewDatabase(db),
	}}
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

	if isProduction {
		log.Println("serving at localhost:443")
		if err := config.Server.ListenAndServeTLS("", ""); err != nil {
			panic(err)
		}
	} else {
		log.Println("serving at localhost:8080")
		if err := config.Server.ListenAndServe(); err != nil {
			panic(err)
		}
	}
}
