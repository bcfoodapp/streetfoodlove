package backend

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"net/http"
	"time"
)

func main() {
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
	database := NewDatabase(db)

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
