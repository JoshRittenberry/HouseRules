using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HouseRules.Data;
using HouseRules.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using HouseRules.Models;
using HouseRules.ModelsDTOs;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public UserProfileController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
            .UserProfiles
            .Include(up => up.IdentityUser)
            .Select(up => new UserProfileDTO
            {
                Id = up.Id,
                FirstName = up.FirstName,
                LastName = up.LastName,
                Address = up.Address,
                IdentityUserId = up.IdentityUserId,
                Email = up.IdentityUser.Email,
                UserName = up.IdentityUser.UserName
            })
            .ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult Get(int id)
    {
        var foundUP = _dbContext
            .UserProfiles
            .Include(up => up.IdentityUser)
            .Include(up => up.AssignedChores)
                .ThenInclude(ac => ac.Chore)
            .Include(up => up.CompletedChores)
                .ThenInclude(cc => cc.Chore)
            .SingleOrDefault(up => up.Id == id);

        return Ok(new UserProfileDTO
        {
            Id = foundUP.Id,
            FirstName = foundUP.FirstName,
            LastName = foundUP.LastName,
            Address = foundUP.Address,
            IdentityUserId = foundUP.IdentityUserId,
            IdentityUser = foundUP.IdentityUser,
            AssignedChores = foundUP.AssignedChores.Select(ac => new ChoreAssignmentDTO
            {
                Id = ac.Id,
                UserProfileId = ac.UserProfileId,
                ChoreId = ac.ChoreId,
                Chore = new ChoreDTO
                {
                    Id = ac.Chore.Id,
                    Name = ac.Chore.Name,
                    Difficutly = ac.Chore.Difficutly,
                    ChoreFrequencyDays = ac.Chore.ChoreFrequencyDays,
                    ChoreCompletions = null
                }
            }).ToList(),
            CompletedChores = foundUP.CompletedChores.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                UserProfile = null,
                ChoreId = cc.ChoreId,
                Chore = new ChoreDTO
                {
                    Id = cc.Chore.Id,
                    Name = cc.Chore.Name,
                    Difficutly = cc.Chore.Difficutly,
                    ChoreFrequencyDays = cc.Chore.ChoreFrequencyDays,
                    ChoreCompletions = null
                },
                CompletedOn = cc.CompletedOn
            }).ToList()
        });
    }

    [HttpGet("withroles")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetWithRoles()
    {
        return Ok(_dbContext.UserProfiles
        .Include(up => up.IdentityUser)
        .Select(up => new UserProfileDTO
        {
            Id = up.Id,
            FirstName = up.FirstName,
            LastName = up.LastName,
            Address = up.Address,
            Email = up.IdentityUser.Email,
            UserName = up.IdentityUser.UserName,
            IdentityUserId = up.IdentityUserId,
            Roles = _dbContext.UserRoles
            .Where(ur => ur.UserId == up.IdentityUserId)
            .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        }));
    }

    [HttpPost("promote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Promote(string id)
    {
        IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");
        // This will create a new row in the many-to-many UserRoles table.
        _dbContext.UserRoles.Add(new IdentityUserRole<string>
        {
            RoleId = role.Id,
            UserId = id
        });
        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpPost("demote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Demote(string id)
    {
        IdentityRole role = _dbContext.Roles
            .SingleOrDefault(r => r.Name == "Admin");
        IdentityUserRole<string> userRole = _dbContext
            .UserRoles
            .SingleOrDefault(ur =>
                ur.RoleId == role.Id &&
                ur.UserId == id);

        _dbContext.UserRoles.Remove(userRole);
        _dbContext.SaveChanges();
        return NoContent();
    }
}