package model

type User struct {
	IdUser   int    `gorm:"primaryKey"`
	Name     string `gorm:"type:varchar(300);not null"`
	Email    string `gorm:"type:varchar(500);not null;unique"`
	Password string `gorm:"type:varchar(200);not null"`
}

type Users []User
