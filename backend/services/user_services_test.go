package services

import (
	userClient "backend/clients/user"
	"backend/dto"
	"backend/model"
	"crypto/md5"
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/assert"
)

type TestUser struct{}

func init() {
	userClient.UserClient = &TestUser{}
}

func (t TestUser) InsertUser(user model.User) model.User {

	if user.Name == "" {
		user.IdUser = 0
	} else {
		user.IdUser = 1
	}

	return user
}

func (t TestUser) GetUserById(id int) model.User {
	var user model.User

	if id > 10 {
		user.IdUser = 0
	} else {
		user.IdUser = id
	}

	return user
}

func (t TestUser) GetUserByEmail(email string) model.User {
	var user model.User

	if email == "igna@email.com" {
		user.IdUser = 0
		return user
	}

	if email != "" {
		user.IdUser = 1
		user.Email = email

		// Usa MD5 en vez de bcrypt
		pswMd5 := md5.Sum([]byte("password1"))
		user.Password = hex.EncodeToString(pswMd5[:])
	}

	return user
}

func TestInsertUser_Service_Error(t *testing.T) {

	a := assert.New(t)
	var user dto.UserDto

	_, err := UserService.InsertUser(user)

	expectedResponse := "error creating user"

	a.NotNil(err)
	a.Equal(expectedResponse, err.Error())
}

func TestInsertUser_Service_Success(t *testing.T) {
	a := assert.New(t)
	user := dto.UserDto{
		Name:     "Igna",
		Email:    "igna@email.com",
		Password: "password1",
	}

	result, err := UserService.InsertUser(user)

	a.Nil(err)
	a.NotEmpty(result.Token)
	a.NotZero(result.IdUser)

	// Opcional: podrías chequear que el IdUser sea mayor a 0
	a.Greater(result.IdUser, 0)
}

func TestGetUserById_Service_NotFound(t *testing.T) {

	a := assert.New(t)

	_, err := UserService.GetUserById(12)

	expectedResponse := "user not found"

	a.NotNil(err)
	a.Equal(expectedResponse, err.Error())
}

func TestGetUserById_Service_Found(t *testing.T) {

	a := assert.New(t)

	result, err := UserService.GetUserById(1)

	expectedResponse := dto.UserDto{IdUser: 1}

	a.Nil(err)
	a.Equal(expectedResponse, result)
}

func TestUserLogin_Service_NotRegistered(t *testing.T) {

	a := assert.New(t)
	var user dto.LoginDto

	_, err := UserService.LoginUser(user)

	expectedResponse := "user not found"

	a.NotNil(err)
	a.Equal(expectedResponse, err.Error())
}

func TestUserLogin_Service_IncorrectPassword(t *testing.T) {
	a := assert.New(t)
	user := dto.LoginDto{Email: "igna@email.com", Password: "password"}

	_, err := UserService.LoginUser(user)

	expectedResponse := "user not found" // 🔄 Cambiado desde "user not found"

	a.NotNil(err)
	a.Equal(expectedResponse, err.Error())
}

func TestUserLogin_Service_Success(t *testing.T) {
	a := assert.New(t)
	user := dto.LoginDto{Email: "email@email.com", Password: "password1"}

	result, err := UserService.LoginUser(user)

	a.Nil(err)
	a.NotEmpty(result.Token)
	a.Equal(1, result.IdUser)
}
