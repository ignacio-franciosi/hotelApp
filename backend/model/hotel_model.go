package model

type Hotel struct {
	IdHotel int     `gorm:"primaryKey"`
	Rooms   int     `gorm:"type:integer;not null"`
	Price   float64 `gorm:"type:decimal(10,2); not null"`
	City    string  `gorm:"type:varchar(250);not null"`
}

type Hotels []Hotel
