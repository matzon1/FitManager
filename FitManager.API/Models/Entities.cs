namespace FitManager.API.Models;

public class Member
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;
    public MemberStatus Status { get; set; } = MemberStatus.Active;

    public ICollection<MemberMembership> MemberMemberships { get; set; } = [];
    public ICollection<Payment> Payments { get; set; } = [];
    public ICollection<AttendanceLog> AttendanceLogs { get; set; } = [];
}

public enum MemberStatus { Active, Frozen, Expired, Cancelled }

public class MembershipPlan
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationMonths { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<MemberMembership> MemberMemberships { get; set; } = [];
}

public class MemberMembership
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int MembershipPlanId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public MembershipStatus Status { get; set; } = MembershipStatus.Active;

    public Member Member { get; set; } = null!;
    public MembershipPlan MembershipPlan { get; set; } = null!;
}

public enum MembershipStatus { Active, Expired, Cancelled }

public class Payment
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int? MemberMembershipId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public PaymentStatus Status { get; set; } = PaymentStatus.Paid;
    public string Notes { get; set; } = string.Empty;

    public Member Member { get; set; } = null!;
}

public enum PaymentStatus { Paid, Pending, Overdue, Refunded }

public class AttendanceLog
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
    public DateTime? CheckOutTime { get; set; }

    public Member Member { get; set; } = null!;
}

public class AppUser
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Staff;
}

public enum UserRole { Admin, Staff }
