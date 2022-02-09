package main

import (
	"encoding/json"
	"github.com/go-sql-driver/mysql"
	"os"
)

type Configuration struct {
	MySQLConfig mysql.Config
}

func production() *Configuration {
	type Secrets struct {
		MySQLPassword string
	}

	file, err := os.Open("secrets.json")
	if err != nil {
		panic(err)
	}

	secrets := &Secrets{}
	if err := json.NewDecoder(file).Decode(secrets); err != nil {
		panic(err)
	}

	mysqlConfig := mysql.NewConfig()
	mysqlConfig.Net = "tcp"
	mysqlConfig.Addr = "sfl-database.cyacnjr02zgl.us-west-2.rds.amazonaws.com"
	mysqlConfig.User = "admin"
	mysqlConfig.Passwd = secrets.MySQLPassword

	return &Configuration{MySQLConfig: *mysqlConfig}
}

func development() *Configuration {
	mysqlConfig := mysql.NewConfig()
	mysqlConfig.User = "root"
	return &Configuration{MySQLConfig: *mysqlConfig}
}
