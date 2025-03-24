package app

import (
	hotelController "backend/controllers/hotel"
	userController "backend/controllers/user"

	log "github.com/sirupsen/logrus"
)

func mapUrls() {
	// Users Mapping (listo)
	router.GET("/user/:id", userController.GetUserById)
	router.POST("/register", userController.InsertUser)
	router.POST("/login", userController.UserLogin)
	router.GET("/login", userController.UserLogin)
	router.GET("/user/email/:email", userController.GetUserByEmail)

	//Hotel Mapping (listo)
	router.POST("/hotel", hotelController.InsertHotel)
	router.GET("/hotel/:id", hotelController.GetHotelById)
	router.DELETE("/hotel/:id", hotelController.DeleteHotel)

	log.Info("Listo el mapeo de configuraciones :)")
}
