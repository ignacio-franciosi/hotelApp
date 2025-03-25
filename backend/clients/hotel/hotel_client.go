package hotel

import (
	"backend/model"

	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InsertHotel(hotel model.Hotel) model.Hotel {
	result := Db.Create(&hotel)

	if result.Error != nil {
		log.Error("Error creating hotel: ", result.Error)
	}

	log.Debug("Hotel Created: ", hotel.IdHotel)
	return hotel
}

func GetHotelById(id string) model.Hotel {
	var hotel model.Hotel

	Db.Where("id_hotel = ?", id).First(&hotel)
	log.Debug("Hotel: ", hotel)

	return hotel
}

func DeleteHotel(hotel model.Hotel) error {
	err := Db.Delete(&hotel).Error

	if err != nil {
		log.Debug("Failed to delete hotel")
	} else {
		log.Debug("Hotel deleted: ", hotel.IdHotel)
	}
	return err
}

func GetHoteles() []model.Hotel {
	var hoteles []model.Hotel

	result := Db.Find(&hoteles)
	if result.Error != nil {
		log.Error("Error retrieving hotels: ", result.Error)
		return nil
	}

	log.Debug("Hoteles found: ", len(hoteles))
	return hoteles
}
