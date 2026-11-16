using Microsoft.EntityFrameworkCore;
using FitManager.API.Models;

namespace FitManager.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Member> Members => Set<Member>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<MemberMembership> MemberMemberships => Set<MemberMembership>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<AttendanceLog> AttendanceLogs => Set<AttendanceLog>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Member>()
            .HasIndex(m => m.Email)
            .IsUnique();

        modelBuilder.Entity<MembershipPlan>()
            .Property(p => p.Price)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<MemberMembership>()
            .HasOne(mm => mm.Member)
            .WithMany(m => m.MemberMemberships)
            .HasForeignKey(mm => mm.MemberId);

        modelBuilder.Entity<MemberMembership>()
            .HasOne(mm => mm.MembershipPlan)
            .WithMany(p => p.MemberMemberships)
            .HasForeignKey(mm => mm.MembershipPlanId);
    }
}
