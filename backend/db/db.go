package db

import (
	hotelClient "backend/clients/hotel"
	userClient "backend/clients/user"
	model2 "backend/model"

	_ "github.com/go-sql-driver/mysql"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db  *gorm.DB
	err error
)

func init() {
	// DB Connections Paramters
	DBName := "ingsw3" //sacar a un config
	DBUser := "root"
	//DBPass := "root"
	DBPass := ""
	//DBPass := os.Getenv("MVC_DB_PASS")

	//DBHost := "arqsw2-db"
	DBHost := "localhost"
	// ------------------------

	db, err = gorm.Open(mysql.Open(DBUser+":"+DBPass+"@tcp("+DBHost+":3306)/"+DBName+"?charset=utf8&parseTime=True"),
		&gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

	if err != nil {
		log.Info("Connection Failed to Open")
		log.Fatal(err)
	} else {
		log.Info("Connection Established")
	}

	// We need to add all CLients that we build
	userClient.Db = db
	hotelClient.Db = db
}

func StartDbEngine() {
	// We need to migrate all classes model.
	db.AutoMigrate(&model2.User{})
	db.AutoMigrate(&model2.Hotel{})

	log.Info("Finishing Migration Database Tables :)")
}
