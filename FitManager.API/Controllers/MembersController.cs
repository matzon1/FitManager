using FitManager.API.Data;
using FitManager.API.DTOs;
using FitManager.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<MemberDto>> GetAll()
    {
        return await db.Members
            .Select(m => new MemberDto(m.Id, m.FirstName, m.LastName, m.Email, m.Phone, m.DateOfBirth, m.JoinDate, m.Status.ToString()))
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetById(int id)
    {
        var m = await db.Members.FindAsync(id);
        if (m is null) return NotFound();
        return new MemberDto(m.Id, m.FirstName, m.LastName, m.Email, m.Phone, m.DateOfBirth, m.JoinDate, m.Status.ToString());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberDto>> Create(CreateMemberRequest req)
    {
        var member = new Member
        {
            FirstName = req.FirstName, LastName = req.LastName,
            Email = req.Email, Phone = req.Phone, DateOfBirth = req.DateOfBirth
        };
        db.Members.Add(member);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = member.Id },
            new MemberDto(member.Id, member.FirstName, member.LastName, member.Email, member.Phone, member.DateOfBirth, member.JoinDate, member.Status.ToString()));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, UpdateMemberRequest req)
    {
        var member = await db.Members.FindAsync(id);
        if (member is null) return NotFound();
        member.FirstName = req.FirstName;
        member.LastName = req.LastName;
        member.Phone = req.Phone;
        member.Status = req.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var member = await db.Members.FindAsync(id);
        if (member is null) return NotFound();
        db.Members.Remove(member);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
