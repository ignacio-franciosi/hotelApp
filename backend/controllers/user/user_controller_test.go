package userController_test

import (
	userController "backend/controllers/user"
	"backend/dto"
	"backend/services"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Mock del UserService
type mockUserService struct{}

func (m *mockUserService) GetUserByEmail(email string) (dto.UserDto, error) {
	if email == "notfound@email.com" {
		return dto.UserDto{}, errors.New("user not found")
	}
	return dto.UserDto{
		IdUser:   1,
		Name:     "Igna",
		Email:    email,
		Password: "password",
	}, nil
}

func (m *mockUserService) GetUserById(id int) (dto.UserDto, error) {
	if id == 0 {
		return dto.UserDto{}, errors.New("user not found")
	}
	return dto.UserDto{
		IdUser:   id,
		Name:     "Igna",
		Email:    "igna@email.com",
		Password: "password",
	}, nil
}

func (m *mockUserService) LoginUser(loginDto dto.LoginDto) (dto.TokenDto, error) {
	if loginDto.Email == "wrong@email.com" {
		return dto.TokenDto{}, errors.New("invalid credentials")
	}
	return dto.TokenDto{Token: "mockedToken"}, nil
}

func (m *mockUserService) InsertUser(userDto dto.UserDto) (dto.TokenDto, error) {
	if userDto.Email == "" {
		return dto.TokenDto{}, errors.New("invalid user data")
	}
	return dto.TokenDto{Token: "createdToken"}, nil
}

func setupTest() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	services.UserService = &mockUserService{}
	return router
}

func TestGetUserByEmail_Success(t *testing.T) {
	router := setupTest()
	router.GET("/user/email/:email", userController.GetUserByEmail)

	req, _ := http.NewRequest(http.MethodGet, "/user/email/igna@email.com", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestGetUserByEmail_NotFound(t *testing.T) {
	router := setupTest()
	router.GET("/user/email/:email", userController.GetUserByEmail)

	req, _ := http.NewRequest(http.MethodGet, "/user/email/notfound@email.com", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetUserById_Success(t *testing.T) {
	router := setupTest()
	router.GET("/user/:id", userController.GetUserById)

	req, _ := http.NewRequest(http.MethodGet, "/user/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestGetUserById_NotFound(t *testing.T) {
	router := setupTest()
	router.GET("/user/:id", userController.GetUserById)

	req, _ := http.NewRequest(http.MethodGet, "/user/0", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusNotFound, resp.Code)
}

func TestUserLogin_Success(t *testing.T) {
	router := setupTest()
	router.POST("/login", userController.LoginUser)

	loginDto := dto.LoginDto{
		Email:    "igna@email.com",
		Password: "password",
	}
	body, _ := json.Marshal(loginDto)

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestUserLogin_InvalidCredentials(t *testing.T) {
	router := setupTest()
	router.POST("/login", userController.LoginUser)

	loginDto := dto.LoginDto{
		Email:    "wrong@email.com",
		Password: "wrongpassword",
	}
	body, _ := json.Marshal(loginDto)

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestInsertUser_Success(t *testing.T) {
	router := setupTest()
	router.POST("/register", userController.InsertUser)

	userDto := dto.UserDto{
		Name:     "Igna",
		Email:    "igna@email.com",
		Password: "password",
	}
	body, _ := json.Marshal(userDto)

	req, _ := http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusCreated, resp.Code)
}

func TestInsertUser_InvalidData(t *testing.T) {
	router := setupTest()
	router.POST("/register", userController.InsertUser)

	userDto := dto.UserDto{}
	body, _ := json.Marshal(userDto)

	req, _ := http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}
