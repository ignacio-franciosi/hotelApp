using Microsoft.EntityFrameworkCore;
using HotelCrudApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelCrudApi.Data
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<Hotel> Hotels { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
