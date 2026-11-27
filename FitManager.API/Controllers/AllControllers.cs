using FitManager.API.Data;
using FitManager.API.DTOs;
using FitManager.API.Models;
using FitManager.API.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace FitManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null) return Unauthorized("Invalid username or password.");
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembershipPlansController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<MembershipPlanDto>> GetAll() =>
        await db.MembershipPlans
            .Select(p => new MembershipPlanDto(p.Id, p.Name, p.Description, p.Price, p.DurationMonths, p.IsActive))
            .ToListAsync();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MembershipPlanDto>> Create(CreateMembershipPlanRequest req)
    {
        var plan = new MembershipPlan { Name = req.Name, Description = req.Description, Price = req.Price, DurationMonths = req.DurationMonths };
        db.MembershipPlans.Add(plan);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new MembershipPlanDto(plan.Id, plan.Name, plan.Description, plan.Price, plan.DurationMonths, plan.IsActive));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var plan = await db.MembershipPlans.FindAsync(id);
        if (plan is null) return NotFound();
        plan.IsActive = false;
        await db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MemberMembershipsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<MemberMembershipDto>> GetAll() =>

        await db.MemberMemberships
            .Include(mm => mm.Member)
            .Include(mm => mm.MembershipPlan)
            .Select(mm => new MemberMembershipDto(mm.Id, mm.MemberId, mm.Member.FirstName + " " + mm.Member.LastName, mm.MembershipPlan.Name, mm.StartDate, mm.EndDate, mm.Status.ToString()))
            .ToListAsync();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberMembershipDto>> Assign(AssignMembershipRequest req)
    {
        var plan = await db.MembershipPlans.FindAsync(req.MembershipPlanId);
        if (plan is null) return NotFound("Plan not found.");
        var member = await db.Members.FindAsync(req.MemberId);
        if (member is null) return NotFound("Member not found.");
        var mm = new MemberMembership
      
        {
            MemberId = req.MemberId,
            MembershipPlanId = req.MembershipPlanId,
            StartDate = req.StartDate,
            EndDate = req.StartDate.AddMonths(plan.DurationMonths)
        };
        db.MemberMemberships.Add(mm);
        await db.SaveChangesAsync();
        return Ok(new MemberMembershipDto(mm.Id, mm.MemberId, member.FirstName + " " + member.LastName, plan.Name, mm.StartDate, mm.EndDate, mm.Status.ToString()));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController(AppDbContext db, IValidator<CreatePaymentRequest> validator) : ControllerBase
{
    
    [HttpGet]
    public async Task<IEnumerable<PaymentDto>> GetAll() =>
        await db.Payments
            .Include(p => p.Member)
            .Select(p => new PaymentDto(p.Id, p.MemberId, p.Member.FirstName + " " + p.Member.LastName, p.Amount, p.PaymentDate, p.Status.ToString(), p.Notes))
            .ToListAsync();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaymentDto>> Create(CreatePaymentRequest req)
    {
        var validationResult = await validator.ValidateAsync(req);
        if (!validationResult.IsValid) return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));
        var payment = new Payment { MemberId = req.MemberId, Amount = req.Amount, Status = req.Status, Notes = req.Notes, MemberMembershipId = req.MemberMembershipId };
        var member = await db.Members.FindAsync(req.MemberId);
        if (member is null) return NotFound("Member not found.");
        db.Payments.Add(payment);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = payment.Id },
    new PaymentDto(payment.Id, payment.MemberId, member.FirstName + " " + member.LastName, payment.Amount, payment.PaymentDate, payment.Status.ToString(), payment.Notes));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetById(int id)
    {
        var payment = await db.Payments.Include(p => p.Member).FirstOrDefaultAsync(p => p.Id == id);
        if (payment is null) return NotFound();
        return new PaymentDto(payment.Id, payment.MemberId, payment.Member.FirstName + " " + payment.Member.LastName, payment.Amount, payment.PaymentDate, payment.Status.ToString(), payment.Notes);
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<AttendanceLogDto>> GetToday()
    {
        var today = DateTime.UtcNow.Date;
        return await db.AttendanceLogs
            .Include(a => a.Member)
            .Where(a => a.CheckInTime.Date == today || a.CheckOutTime == null)
            .OrderByDescending(a => a.CheckInTime)
            .Select(a => new AttendanceLogDto(a.Id, a.MemberId, a.Member.FirstName + " " + a.Member.LastName, a.CheckInTime, a.CheckOutTime))
            .ToListAsync();
    }

    [HttpPost("checkin/{memberId}")]
    public async Task<ActionResult<AttendanceLogDto>> CheckIn(int memberId)
    {
        var member = await db.Members.FindAsync(memberId);
        if (member is null) return NotFound("Member not found.");
        if (await db.AttendanceLogs.AnyAsync(a => a.MemberId == memberId && a.CheckOutTime == null))
           return Conflict("Member is already checked in");
        var log = new AttendanceLog { MemberId = memberId };
        db.AttendanceLogs.Add(log);
        await db.SaveChangesAsync();
        return Ok(new AttendanceLogDto(log.Id, log.MemberId, member.FirstName + " " + member.LastName, log.CheckInTime, log.CheckOutTime));
    }

    [HttpPut("checkout/{logId}")]
    public async Task<IActionResult> CheckOut(int logId)
    {
        var log = await db.AttendanceLogs.FindAsync(logId);
        if (log is null) return NotFound();
        if (log.CheckOutTime is not null) return BadRequest("Already checked out.");
        log.CheckOutTime = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<DashboardStatsDto> GetStats()
    {
        var now = DateTime.UtcNow;
        var activeMembers = await db.Members.CountAsync(m => m.Status == MemberStatus.Active);
        var paidAmounts = await db.Payments
            .Where(p => p.Status == PaymentStatus.Paid && p.PaymentDate.Month == now.Month && p.PaymentDate.Year == now.Year)
            .Select(p => p.Amount)
            .ToListAsync();
        var revenueThisMonth = paidAmounts.Sum();
        var checkInsToday = await db.AttendanceLogs.CountAsync(a => a.CheckInTime.Date == now.Date);
        var expiringSoon = await db.MemberMemberships
            .CountAsync(mm => mm.Status == MembershipStatus.Active && mm.EndDate <= now.AddDays(30));
        var recentCheckIns = await db.AttendanceLogs
            .Include(a => a.Member)
            .OrderByDescending(a => a.CheckInTime)
            .Take(5)
            .Select(a => new AttendanceLogDto(a.Id, a.MemberId, a.Member.FirstName + " " + a.Member.LastName, a.CheckInTime, a.CheckOutTime))
            .ToListAsync();

        return new DashboardStatsDto(activeMembers, revenueThisMonth, checkInsToday, expiringSoon, recentCheckIns);
    }
}
