package dto

type UserDto struct {
	IdUser   int    `json:"id_user"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UsersDto []UserDto
