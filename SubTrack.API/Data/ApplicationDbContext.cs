using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using SubTrack.API.Models;

namespace SubTrack.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Subscription>(e =>
            {
                e.Property(s => s.Cost).HasPrecision(18, 2);

                e.HasOne(s => s.Category)
                .WithMany(c => c.Subscriptions)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(s => s.UserId);
                e.HasIndex(s => new { s.UserId, s.NextRenewalDate });

                e.ToTable(t => t.HasCheckConstraint("CK_Subscriptions_Cost", "[Cost] > 0"));
            });

            builder.Entity<Category>(e =>
            {
                e.Property(c => c.Name).HasMaxLength(50).IsRequired();
                e.HasIndex(c => c.Name).IsUnique();
            });

            // Seed reference data
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Entertainment" },
                new Category { Id = 2, Name = "Productivity" },
                new Category { Id = 3, Name = "Utilities" },
                new Category { Id = 4, Name = "Health" },
                new Category { Id = 5, Name = "Education" },
                new Category { Id = 6, Name = "Other" }
            );
        }
    }
}
