using HotelCrudApi.Data;
using HotelCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions; // Importa Regex
using System.Threading.Tasks;

namespace HotelCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HotelController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Hotel>> GetAll()
        {
            return await _context.Hotels.ToListAsync();
        }

        [HttpGet]
        public async Task<Hotel> GetById(int id)
        {
            return await _context.Hotels.FindAsync(id);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Hotel hotel)
        {
            var hotelToUpdate = await _context.Hotels.FindAsync(hotel.Id);
            if (hotelToUpdate == null)
            {
                return NotFound("Hotel no encontrado.");
            }

            hotelToUpdate.Name = hotel.Name;
            hotelToUpdate.Price = hotel.Price;
            hotelToUpdate.Rooms = hotel.Rooms;
            hotelToUpdate.City = hotel.City;
            // Otras actualizaciones...
            await _context.SaveChangesAsync();

            return Ok("Hotel actualizado exitosamente.");
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var hotelToDelete = await _context.Hotels.FindAsync(id);
            if (hotelToDelete == null)
            {
                return NotFound("Hotel no encontrado.");
            }

            _context.Hotels.Remove(hotelToDelete);
            await _context.SaveChangesAsync();

            return Ok("Hotel eliminado exitosamente.");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Hotel hotel)
        {
            // 1. Nombre del hotel no repetido
            if (await _context.Hotels.AnyAsync(h => h.Name == hotel.Name))
            {
                return BadRequest("El nombre del hotel ya está registrado.");
            }

            // 2. Longitud mínima del nombre de hotel (2 caracteres)
            if (hotel.Name.Length < 2)
            {
                return BadRequest("El nombre debe tener al menos 2 caracteres.");
            }

            // 3. Longitud mínima de ciudad (2 caracteres)
            if (hotel.City.Length < 2)
            {
                return BadRequest("El nombre de ciudad debe tener al menos 2 caracteres.");
            }

            // 4. Verificar que ciudad no contenga números
            if (Regex.IsMatch(hotel.City, @"\d"))
            {
                return BadRequest("El nombre de ciudad no puede contener números.");
            }

            //5. El precio debe ser mayor a 0
            if (hotel.Price <= 0)
            {
                return BadRequest("El precio por habitacion debe ser mayor a 0");
            }

            //6. El campo rooms es obligatorio
            if (hotel.Rooms <= 0)
            {
                return BadRequest("El hotel debe tener un valor de habitaciones");
            }



            // Si todo está bien, agregar el hotel
            await _context.Hotels.AddAsync(hotel);
            await _context.SaveChangesAsync();

            return Ok("Hotel agregado exitosamente.");
        }

    }
}
