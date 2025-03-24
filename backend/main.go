package main

import (
	"backend/app"
	"backend/db"
	utils "backend/utils/cache"
)

func main() {
	utils.InitCache()
	db.StartDbEngine()
	app.StartRoute()

}
