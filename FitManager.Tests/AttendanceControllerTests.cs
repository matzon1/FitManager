using FitManager.API.Controllers;
using FitManager.API.Data;
using FitManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace FitManager.Tests;

public class AttendanceControllerTests
{
    [Fact]
    public async Task CheckIn_MemberAlreadyCheckedIn_ReturnsConflict()
    {
        // Arrange
        using var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();   // the database lives only while this connection is open

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        using var db = new AppDbContext(options);
        db.Database.EnsureCreated();   // creates the tables


        // TODO 1: add a Member to db.Members and call db.SaveChanges()


        var member = new Member
        {
            FirstName = "Test",
            LastName = "1",

        };
        db.Members.Add(member);
        db.SaveChanges();

        var controller = new AttendanceController(db);

        var first = await controller.CheckIn(member.Id);

        var second = await controller.CheckIn(member.Id);

        Assert.IsType<OkObjectResult>(first.Result);
        Assert.IsType<ConflictObjectResult>(second.Result);

    }

    }