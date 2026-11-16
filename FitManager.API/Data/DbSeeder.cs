using FitManager.API.Models;

namespace FitManager.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any()) return;

        context.Users.AddRange(
            new AppUser { Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = UserRole.Admin },
            new AppUser { Username = "staff", PasswordHash = BCrypt.Net.BCrypt.HashPassword("staff123"), Role = UserRole.Staff }
        );

        var plans = new List<MembershipPlan>
        {
            new() { Name = "Monthly", Description = "Rolling monthly membership", Price = 49.99m, DurationMonths = 1 },
            new() { Name = "Quarterly", Description = "3-month membership, save 10%", Price = 134.99m, DurationMonths = 3 },
            new() { Name = "Annual", Description = "12-month membership, best value", Price = 479.99m, DurationMonths = 12 }
        };
        context.MembershipPlans.AddRange(plans);

        var members = new List<Member>
        {
            new() { FirstName = "Alice", LastName = "Johnson", Email = "alice@example.com", Phone = "0412 000 001", DateOfBirth = new DateTime(1990, 5, 12), Status = MemberStatus.Active },
            new() { FirstName = "Bob", LastName = "Smith", Email = "bob@example.com", Phone = "0412 000 002", DateOfBirth = new DateTime(1985, 8, 23), Status = MemberStatus.Active },
            new() { FirstName = "Carol", LastName = "White", Email = "carol@example.com", Phone = "0412 000 003", DateOfBirth = new DateTime(1995, 2, 14), Status = MemberStatus.Frozen },
        };
        context.Members.AddRange(members);
        context.SaveChanges();

        context.MemberMemberships.AddRange(
            new MemberMembership { MemberId = members[0].Id, MembershipPlanId = plans[2].Id, StartDate = DateTime.UtcNow.AddMonths(-2), EndDate = DateTime.UtcNow.AddMonths(10), Status = MembershipStatus.Active },
            new MemberMembership { MemberId = members[1].Id, MembershipPlanId = plans[0].Id, StartDate = DateTime.UtcNow.AddDays(-10), EndDate = DateTime.UtcNow.AddDays(20), Status = MembershipStatus.Active }
        );

        context.Payments.AddRange(
            new Payment { MemberId = members[0].Id, Amount = 479.99m, Status = PaymentStatus.Paid, Notes = "Annual plan" },
            new Payment { MemberId = members[1].Id, Amount = 49.99m, Status = PaymentStatus.Paid, Notes = "Monthly plan" },
            new Payment { MemberId = members[2].Id, Amount = 134.99m, Status = PaymentStatus.Overdue, Notes = "Quarterly plan - overdue" }
        );

        context.AttendanceLogs.AddRange(
            new AttendanceLog { MemberId = members[0].Id, CheckInTime = DateTime.UtcNow.AddHours(-2), CheckOutTime = DateTime.UtcNow.AddHours(-1) },
            new AttendanceLog { MemberId = members[1].Id, CheckInTime = DateTime.UtcNow.AddHours(-1) }
        );

        context.SaveChanges();
    }
}
