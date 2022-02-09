package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"net/http"
	"os"
	"time"
)

func main() {
	var configuration *Configuration

	if _, isProduction := os.LookupEnv("PRODUCTION"); isProduction {
		configuration = production()
	} else {
		configuration = development()
	}

	db, err := sqlx.Connect("mysql", configuration.MySQLConfig.FormatDSN())
	if err != nil {
		panic(err)
	}

	api := API{&Backend{database.NewDatabase(db)}}
	defer func() {
		if err := api.Close(); err != nil {
			panic(err)
		}
	}()

	router := gin.Default()
	api.AddRoutes(router)

	server := http.Server{
		Addr:         ":8080",
		Handler:      router,
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}
	defer func() {
		if err := server.Close(); err != nil {
			panic(err)
		}
	}()

	fmt.Println("serving at localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		panic(err)
	}
}
