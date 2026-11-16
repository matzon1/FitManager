using FitManager.API.Models;

namespace FitManager.API.DTOs;

// Auth
public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string Username, string Role);

// Members
public record MemberDto(int Id, string FirstName, string LastName, string Email, string Phone, DateTime DateOfBirth, DateTime JoinDate, string Status);
public record CreateMemberRequest(string FirstName, string LastName, string Email, string Phone, DateTime DateOfBirth);
public record UpdateMemberRequest(string FirstName, string LastName, string Phone, MemberStatus Status);

// Membership Plans
public record MembershipPlanDto(int Id, string Name, string Description, decimal Price, int DurationMonths, bool IsActive);
public record CreateMembershipPlanRequest(string Name, string Description, decimal Price, int DurationMonths);

// Member Memberships
public record MemberMembershipDto(int Id, int MemberId, string MemberName, string PlanName, DateTime StartDate, DateTime EndDate, string Status);
public record AssignMembershipRequest(int MemberId, int MembershipPlanId, DateTime StartDate);

// Payments
public record PaymentDto(int Id, int MemberId, string MemberName, decimal Amount, DateTime PaymentDate, string Status, string Notes);
public record CreatePaymentRequest(int MemberId, decimal Amount, PaymentStatus Status, string Notes, int? MemberMembershipId);

// Attendance
public record AttendanceLogDto(int Id, int MemberId, string MemberName, DateTime CheckInTime, DateTime? CheckOutTime);

// Dashboard
public record DashboardStatsDto(int TotalActiveMembers, decimal RevenueThisMonth, int CheckInsToday, int ExpiringSoon, IEnumerable<AttendanceLogDto> RecentCheckIns);
