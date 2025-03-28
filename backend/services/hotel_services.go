package services

import (
	hotelClient "backend/clients/hotel"
	"backend/dto"
	"backend/model"
	e "backend/utils/errors"
)

type hotelService struct{}

type hotelServiceInterface interface {
	InsertHotel(hotelDto dto.HotelDto) (dto.HotelDto, e.ApiError)
	GetHotelById(id string) (dto.HotelDto, e.ApiError)
	DeleteHotel(id string) error
	GetHoteles() ([]dto.HotelDto, e.ApiError)
}

var (
	HotelService hotelServiceInterface
)

func init() {
	HotelService = &hotelService{}
}

func (s *hotelService) InsertHotel(hotelDto dto.HotelDto) (dto.HotelDto, e.ApiError) {
	var hotel model.Hotel

	hotel.Rooms = hotelDto.Rooms
	hotel.Price = hotelDto.Price
	hotel.City = hotelDto.City

	hotel = hotelClient.InsertHotel(hotel)

	var response dto.HotelDto

	response.IdHotel = hotel.IdHotel
	response.Rooms = hotel.Rooms
	response.Price = hotel.Price
	response.City = hotel.City

	return response, nil
}

func (s *hotelService) GetHoteles() ([]dto.HotelDto, e.ApiError) {
	hoteles := hotelClient.GetHoteles() // Llamada al cliente para obtener todos los hoteles

	var hotelesDto []dto.HotelDto
	for _, hotel := range hoteles {
		hotelDto := dto.HotelDto{
			IdHotel: hotel.IdHotel,
			Rooms:   hotel.Rooms,
			Price:   hotel.Price,
			City:    hotel.City,
		}
		hotelesDto = append(hotelesDto, hotelDto)
	}

	return hotelesDto, nil
}

func (s *hotelService) GetHotelById(id string) (dto.HotelDto, e.ApiError) {
	var hotel model.Hotel = hotelClient.GetHotelById(id)
	var hotelDto dto.HotelDto

	hotelDto.IdHotel = hotel.IdHotel
	hotelDto.Rooms = hotel.Rooms
	hotelDto.Price = hotel.Price
	hotelDto.City = hotel.City
	return hotelDto, nil

}

func (s *hotelService) DeleteHotel(id string) error {

	hotel := hotelClient.GetHotelById(id)

	err := hotelClient.DeleteHotel(hotel)

	return err
}
