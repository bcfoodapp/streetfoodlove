package database

import (
	"crypto/tls"
	"encoding/json"
	"github.com/go-sql-driver/mysql"
	"net/http"
	"os"
	"time"
)

// Configuration contains configuration variables that are different from production vs development
// environments.
type Configuration struct {
	MySQLConfig mysql.Config
	Server      http.Server
}

func commonMySQLConfig() *mysql.Config {
	mysqlConfig := mysql.NewConfig()
	mysqlConfig.AllowNativePasswords = true
	mysqlConfig.DBName = "streetfoodlove"
	mysqlConfig.ParseTime = true
	return mysqlConfig
}

func commonServer() http.Server {
	return http.Server{
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}
}

type Secrets struct {
	// Password for MySQL connection
	MySQLPassword string
}

func Production(secretsPath string) *Configuration {
	file, err := os.Open(secretsPath)
	if err != nil {
		panic(err)
	}

	secrets := &Secrets{}
	if err := json.NewDecoder(file).Decode(secrets); err != nil {
		panic(err)
	}

	mysqlConfig := commonMySQLConfig()
	mysqlConfig.Net = "tcp"
	mysqlConfig.Addr = "sfl-database.coffj5yx52hn.us-west-2.rds.amazonaws.com"
	mysqlConfig.User = "admin"
	mysqlConfig.Passwd = secrets.MySQLPassword

	certificate, err := tls.LoadX509KeyPair("../cert.crt", "../cert.key")
	if err != nil {
		panic(err)
	}

	server := commonServer()
	server.Addr = ":443"
	server.TLSConfig = &tls.Config{
		Certificates: []tls.Certificate{certificate},
	}

	//goland:noinspection GoVetCopyLock
	return &Configuration{
		MySQLConfig: *mysqlConfig,
		// nolint:govet
		Server: server,
	}
}

func Development() *Configuration {
	mysqlConfig := commonMySQLConfig()
	mysqlConfig.User = "root"

	server := commonServer()
	server.Addr = ":8080"

	//goland:noinspection GoVetCopyLock
	return &Configuration{
		MySQLConfig: *mysqlConfig,
		// nolint:govet
		Server: server,
	}
}
