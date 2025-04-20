using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
           new IdentityRole { Id = "1d0ae8e4-a2fc-4e99-bff7-5a153884c1cc", Name = "Admin", NormalizedName = "ADMIN" },
           new IdentityRole { Id = "af18fc4c-7c5f-42a0-b98e-f8653c0a1fbb", Name = "Customer", NormalizedName = "CUSTOMER" });
        }
    }
}