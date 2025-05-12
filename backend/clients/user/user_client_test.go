package user

import (
	"backend/model"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func TestInsertUser_Client(t *testing.T) {
	a := assert.New(t)

	// Usamos QueryMatcherRegexp para permitir más flexibilidad en el SQL
	db, mock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherRegexp))
	if err != nil {
		t.Fatalf("Failed to create mock database: %s", err)
	}
	defer db.Close()

	gormDB, err := gorm.Open(sqlserver.New(sqlserver.Config{
		DriverName: "sqlserver",
		Conn:       db,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		t.Fatalf("Failed to open GORM database: %s", err)
	}

	// Seteamos las variables globales
	Db = gormDB
	UserClient = &userClient{}

	// El usuario de prueba
	user := model.User{
		IdUser:   1,
		Name:     "John",
		Email:    "johndoe@email.com",
		Password: "password",
	}

	// Mockeamos la transacción
	mock.ExpectBegin()

	mock.ExpectQuery(`INSERT INTO .*users.*`).
		WithArgs(user.Name, user.Email, user.Password, user.IdUser).
		WillReturnRows(
			sqlmock.NewRows([]string{"id_user"}).AddRow(1),
		)

	mock.ExpectCommit()

	// Ejecutamos la función
	result := UserClient.InsertUser(user)

	// Assertions
	a.Equal(user.Name, result.Name)
	a.Equal(user.Email, result.Email)
	a.Equal(user.Password, result.Password)
	a.Equal(user.IdUser, result.IdUser)

	// Chequeamos que todo lo que esperamos fue llamado
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("There were unfulfilled expectations: %s", err)
	}
}

func TestGetUserById_Client(t *testing.T) {
	a := assert.New(t)

	db, mock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherRegexp))
	if err != nil {
		t.Fatalf("Failed to create mock database: %s", err)
	}
	defer db.Close()

	gormDB, err := gorm.Open(sqlserver.New(sqlserver.Config{
		DriverName: "sqlserver",
		Conn:       db,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		t.Fatalf("Failed to open GORM database: %s", err)
	}

	Db = gormDB
	UserClient = &userClient{}

	user := model.User{
		IdUser:   1,
		Name:     "Igna",
		Email:    "igna@email.com",
		Password: "password",
	}

	mock.ExpectQuery(`SELECT .* FROM .*users.* WHERE .*id_user.*`).
		WithArgs(user.IdUser).
		WillReturnRows(sqlmock.NewRows([]string{"id_user", "name", "email", "password"}).
			AddRow(user.IdUser, user.Name, user.Email, user.Password))

	result := UserClient.GetUserById(user.IdUser)

	a.Equal(user.IdUser, result.IdUser)
	a.Equal(user.Name, result.Name)
	a.Equal(user.Email, result.Email)
	a.Equal(user.Password, result.Password)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("There were unfulfilled expectations: %s", err)
	}
}

func TestGetUserByEmail_Client(t *testing.T) {
	a := assert.New(t)

	db, mock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherRegexp))
	if err != nil {
		t.Fatalf("Failed to create mock database: %s", err)
	}
	defer db.Close()

	gormDB, err := gorm.Open(sqlserver.New(sqlserver.Config{
		DriverName: "sqlserver",
		Conn:       db,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		t.Fatalf("Failed to open GORM database: %s", err)
	}

	Db = gormDB
	UserClient = &userClient{}

	user := model.User{
		IdUser:   1,
		Name:     "Igna",
		Email:    "igna@email.com",
		Password: "password",
	}

	mock.ExpectQuery(`SELECT .* FROM .*users.* WHERE .*email.*`).
		WithArgs(user.Email).
		WillReturnRows(sqlmock.NewRows([]string{"id_user", "name", "email", "password"}).
			AddRow(user.IdUser, user.Name, user.Email, user.Password))

	result := UserClient.GetUserByEmail(user.Email)

	a.Equal(user.IdUser, result.IdUser)
	a.Equal(user.Name, result.Name)
	a.Equal(user.Email, result.Email)
	a.Equal(user.Password, result.Password)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("There were unfulfilled expectations: %s", err)
	}
}
