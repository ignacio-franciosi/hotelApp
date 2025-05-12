package services

import (
	userClient "backend/clients/user"
	dto2 "backend/dto"
	"backend/model"
	"crypto/md5"
	"encoding/hex"
	"errors"

	"github.com/dgrijalva/jwt-go"

	log "github.com/sirupsen/logrus"
)

type userService struct{}

type userServiceInterface interface {
	GetUserById(id int) (dto2.UserDto, error)
	LoginUser(loginDto dto2.LoginDto) (dto2.TokenDto, error)
	InsertUser(userDto dto2.UserDto) (dto2.TokenDto, error)
	GetUserByEmail(email string) (dto2.UserDto, error)
}

var (
	UserService userServiceInterface
)

func init() {
	UserService = &userService{}
}

func (s *userService) GetUserById(id int) (dto2.UserDto, error) {

	var user model.User = userClient.UserClient.GetUserById(id)
	var userDto dto2.UserDto

	if user.IdUser == 0 {
		return userDto, errors.New("user not found") // Modificado a "user not found"
	}
	userDto.IdUser = user.IdUser
	userDto.Name = user.Name
	userDto.Email = user.Email
	userDto.Password = user.Password

	return userDto, nil
}

func (s *userService) GetUserByEmail(email string) (dto2.UserDto, error) {

	var user model.User = userClient.UserClient.GetUserByEmail(email)
	var userDto dto2.UserDto

	if user.Email == "" {
		return userDto, errors.New("user not found") // Modificado a "user not found"
	}
	userDto.IdUser = user.IdUser
	userDto.Name = user.Name
	userDto.Email = user.Email
	userDto.Password = user.Password

	return userDto, nil
}

// Login
var jwtKey = []byte("secret_key")

func (s *userService) LoginUser(loginDto dto2.LoginDto) (dto2.TokenDto, error) {

	log.Debug(loginDto) // Para registrar el contenido de loginDto
	var user model.User = userClient.UserClient.GetUserByEmail(loginDto.Email)
	var tokenDto dto2.TokenDto

	if user.IdUser == 0 {
		return tokenDto, errors.New("user not found") // Mensaje de usuario no encontrado
	}

	// Pasamos la contraseña como slice de bytes
	// Hashea con md5.Sum
	var pswMd5 = md5.Sum([]byte(loginDto.Password))
	// Convertir a cadena hexadecimal
	pswMd5String := hex.EncodeToString(pswMd5[:])

	if pswMd5String != user.Password {
		// Contraseña incorrecta
		return tokenDto, errors.New("incorrect password")
	}

	// Si la contraseña es correcta, generar el token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id_user": user.IdUser,
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return tokenDto, errors.New("error generating token") // Error al generar el token
	}

	// Asignar el token generado al TokenDto
	tokenDto.Token = tokenString
	tokenDto.IdUser = user.IdUser

	return tokenDto, nil // Devolver el tokenDto generado
}

func (s *userService) InsertUser(userDto dto2.UserDto) (dto2.TokenDto, error) {
	log.Debug(userDto)

	var tokenDto dto2.TokenDto

	// Validar campos obligatorios
	if userDto.Name == "" || userDto.Email == "" || userDto.Password == "" {
		return tokenDto, errors.New("error creating user") // Modificado a "error creating user"
	}

	// Verificar si ya existe un usuario con el mismo email
	existingUser := userClient.UserClient.GetUserByEmail(userDto.Email)
	if existingUser.IdUser != 0 {
		return tokenDto, errors.New("user already exists") // Modificado a "user already exists"
	}

	// Encriptar la contraseña con MD5
	var pswMd5 = md5.Sum([]byte(userDto.Password))
	pswMd5String := hex.EncodeToString(pswMd5[:])

	// Crear el nuevo usuario
	newUser := model.User{
		Name:     userDto.Name,
		Email:    userDto.Email,
		Password: pswMd5String,
	}

	createdUser := userClient.UserClient.InsertUser(newUser)

	if createdUser.IdUser == 0 {
		return tokenDto, errors.New("error creating user") // Modificado a "error creating user"
	}

	// Generar token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id_user": createdUser.IdUser,
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return tokenDto, errors.New("error generating token") // Modificado a "error generating token"
	}

	tokenDto.Token = tokenString
	tokenDto.IdUser = createdUser.IdUser

	return tokenDto, nil
}
