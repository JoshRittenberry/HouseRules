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
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
            .Chores
            .Select(c => new ChoreDTO
            {
                Id = c.Id,
                Name = c.Name,
                Difficutly = c.Difficutly,
                ChoreFrequencyDays = c.ChoreFrequencyDays,
                ChoreCompletions = null
            })
            .ToList()
        );
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult Get(int id)
    {
        var chore = _dbContext
            .Chores
            .Include(c => c.ChoreCompletions)
            .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        return Ok(new ChoreDTO
        {
            Id = chore.Id,
            Name = chore.Name,
            Difficutly = chore.Difficutly,
            ChoreFrequencyDays = chore.ChoreFrequencyDays,
            ChoreCompletions = chore.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                UserProfile = null,
                ChoreId = cc.ChoreId,
                Chore = null,
                CompletedOn = cc.CompletedOn
            }).ToList()
        });
    }
}