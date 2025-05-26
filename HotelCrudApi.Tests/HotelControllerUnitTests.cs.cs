using HotelCrudApi.Controllers;
using HotelCrudApi.Data;
using HotelCrudApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc;

namespace HotelCrudApi.Tests
{
    public class HotelControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Crear una nueva base de datos en memoria para cada prueba
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfHotels()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Hotels.AddRange(
                new Hotel { Id = 1, Name = "Hotel A", Price = 25, Rooms = 5, City = "City A" },
                new Hotel { Id = 2, Name = "Hotel B", Price = 20, Rooms = 3, City = "City B"  }
            );
            context.SaveChanges();

            var controller = new HotelController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("Hotel A", result[0].Name);
            Assert.Equal("Hotel B", result[1].Name);
        }

        [Fact]
        public async Task GetById_ReturnsHotelById()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Hotels.Add(new Hotel { Id = 1, Name = "Hotel A", Price = 20, Rooms = 3, City = "City A"  });
            context.SaveChanges();

            var controller = new HotelController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Hotel A", result.Name);
            Assert.Equal(20, result.Price);
            Assert.Equal(3, result.Rooms);
            Assert.Equal("City A", result.City);

        }

        [Fact]
        public async Task Create_AddsHotel()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new HotelController(context);

            var newHotel = new Hotel { Id = 3, Name = "Hotel A",  Price = 20, Rooms = 3, City = "City A"  };

            // Act
            await controller.Create(newHotel);

            // Assert
            var hotel = await context.Hotels.FindAsync(3);
            Assert.NotNull(hotel);
            Assert.Equal("Hotel A", hotel.Name);
            Assert.Equal(20, hotel.Price);
            Assert.Equal(3, hotel.Rooms);
            Assert.Equal("City A", hotel.City);
        }

        [Fact]
        public async Task Update_UpdatesHotel()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var existingHotel = new Hotel { Id = 1, Name = "Old Hotel", Price = 20, Rooms = 3, City = "City A" };
            context.Hotels.Add(existingHotel);
            context.SaveChanges();

            var controller = new HotelController(context);

            var updatedHotel = new Hotel { Id = 1, Name = "New Hotel", Price = 21, Rooms = 4, City = "City B" };

            // Act
            await controller.Update(updatedHotel);

            // Assert
            var hotel = await context.Hotels.FindAsync(1);
            Assert.NotNull(hotel);
            Assert.Equal("New Hotel", hotel.Name);
            Assert.Equal(21, hotel.Price);
            Assert.Equal(4, hotel.Rooms);
            Assert.Equal("City B", hotel.City);
            
        }

        [Fact]
        public async Task Delete_RemovesHotel()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var hotelToDelete = new Hotel { Id = 1, Name = "Hotel A",  Price = 20, Rooms = 3, City = "City A" };
            context.Hotels.Add(hotelToDelete);
            context.SaveChanges();

            var controller = new HotelController(context);

            // Act
            await controller.Delete(1);

            // Assert
            var hotel = await context.Hotels.FindAsync(1);
            Assert.Null(hotel); // Verifica que el hotel fue eliminado
        }

        //Pruebas Unitarias de 5 escenarios elegidos

        
        [Fact]
public async Task AddHotel_NameAlreadyExists_ReturnsBadRequest()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var controller = new HotelController(context);

    var hotel1 = new Hotel { Name = "Hotel Sheraton", Price = 20, Rooms = 3, City = "City A" };
    var hotel2 = new Hotel { Name = "Hotel Sheraton", Price = 20, Rooms = 3, City = "City A" };
    await controller.Create(hotel1); // Agrega el primer hotel

    // Act
    var result = await controller.Create(hotel2); // Intenta agregar el segundo con el mismo nombre

    // Assert
    Assert.IsType<BadRequestObjectResult>(result);
    var badRequestResult = result as BadRequestObjectResult;
    Assert.Equal("El nombre del hotel ya está registrado.", badRequestResult.Value);
}

[Fact]
public async Task AddHotel_RoomsQuantityIsLowerThanOne_ReturnsBadRequest()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var controller = new HotelController(context);
    var hotel = new Hotel { Name = "Hotel A", Price = 20, Rooms = 0, City = "City A" };

    // Act
    var result = await controller.Create(hotel);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result);
    var badRequestResult = result as BadRequestObjectResult;
    Assert.Equal("El hotel debe tener un valor de habitaciones", badRequestResult.Value);
}

[Fact]
public async Task AddHotel_NameHasLessThanTwoCharacters_ReturnsBadRequest()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var controller = new HotelController(context);
    var hotel = new Hotel { Name = "H", Price = 20, Rooms = 3, City = "City A" };

    // Act
    var result = await controller.Create(hotel);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result);
    var badRequestResult = result as BadRequestObjectResult;
    Assert.Equal("El nombre debe tener al menos 2 caracteres.", badRequestResult.Value);
}

[Fact]
public async Task AddHotel_CityContainsNumbers_ReturnsBadRequest()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var controller = new HotelController(context);
    var hotel = new Hotel { Name = "Hotel Sheraton", Price = 20, Rooms = 3, City = "City123" };

    // Act
    var result = await controller.Create(hotel);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result);
    var badRequestResult = result as BadRequestObjectResult;
    Assert.Equal("El nombre de ciudad no puede contener números.", badRequestResult.Value);
}

[Fact]
public async Task AddHotel_PriceIsLowerThanOne_ReturnsBadRequest()
{
    // Arrange
    var context = GetInMemoryDbContext();
    var controller = new HotelController(context);
    var hotel = new Hotel { Name = "Hotel A", Price = 0, Rooms = 3, City = "City A" };

    // Act
    var result = await controller.Create(hotel);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result);
    var badRequestResult = result as BadRequestObjectResult;
    Assert.Equal("El precio por habitacion debe ser mayor a 0", badRequestResult.Value);
}

}
}