package main

import (
	"encoding/json"
	"github.com/go-sql-driver/mysql"
	"os"
)

type Configuration struct {
	MySQLConfig mysql.Config
}

func commonMySQLConfig() *mysql.Config {
	mysqlConfig := mysql.NewConfig()
	mysqlConfig.AllowNativePasswords = true
	mysqlConfig.DBName = "streetfoodlove"
	mysqlConfig.ParseTime = true
	return mysqlConfig
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

	mysqlConfig := commonMySQLConfig()
	mysqlConfig.Net = "tcp"
	mysqlConfig.Addr = "sfl-database.cyacnjr02zgl.us-west-2.rds.amazonaws.com"
	mysqlConfig.User = "admin"
	mysqlConfig.Passwd = secrets.MySQLPassword

	return &Configuration{MySQLConfig: *mysqlConfig}
}

func development() *Configuration {
	mysqlConfig := commonMySQLConfig()
	mysqlConfig.User = "root"
	return &Configuration{MySQLConfig: *mysqlConfig}
}
