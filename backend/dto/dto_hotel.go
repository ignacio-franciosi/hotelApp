package dto

type HotelDto struct {
	IdHotel int     `json:"id_hotel"`
	Rooms   int     `json:"rooms"`
	Price   float64 `json:"price"`
	City    string  `json:"city"`
}

type HotelsDto []HotelDto
