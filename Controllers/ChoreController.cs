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
            .Include(c => c.ChoreCompletions)
                .ThenInclude(cc => cc.UserProfile)
            .Select(c => new ChoreDTO
            {
                Id = c.Id,
                Name = c.Name,
                Difficulty = c.Difficulty,
                ChoreFrequencyDays = c.ChoreFrequencyDays,
                ChoreCompletions = c.ChoreCompletions.Select(cc => new ChoreCompletionDTO
                {
                    Id = cc.Id,
                    UserProfileId = cc.UserProfileId,
                    UserProfile = new UserProfileDTO
                    {
                        Id = cc.UserProfile.Id,
                        FirstName = cc.UserProfile.FirstName,
                        LastName = cc.UserProfile.LastName,
                        Address = cc.UserProfile.Address,
                        IdentityUserId = cc.UserProfile.IdentityUserId,
                        IdentityUser = cc.UserProfile.IdentityUser,
                        AssignedChores = null,
                        CompletedChores = null
                    },
                    ChoreId = cc.ChoreId,
                    Chore = null,
                    CompletedOn = cc.CompletedOn
                }).ToList()
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
                .ThenInclude(cc => cc.UserProfile)
            .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        return Ok(new ChoreDTO
        {
            Id = chore.Id,
            Name = chore.Name,
            Difficulty = chore.Difficulty,
            ChoreFrequencyDays = chore.ChoreFrequencyDays,
            ChoreCompletions = chore.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                UserProfile = new UserProfileDTO
                {
                    Id = cc.UserProfile.Id,
                    FirstName = cc.UserProfile.FirstName,
                    LastName = cc.UserProfile.LastName,
                    Address = cc.UserProfile.Address,
                    IdentityUserId = cc.UserProfile.IdentityUserId,
                    IdentityUser = cc.UserProfile.IdentityUser,
                    AssignedChores = null,
                    CompletedChores = null
                },
                ChoreId = cc.ChoreId,
                Chore = null,
                CompletedOn = cc.CompletedOn
            }).ToList()
        });
    }

    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CreateChoreCompletion(int id, [FromQuery] int? userId)
    {
        // Check to see if the user exists
        var user = _dbContext
            .UserProfiles
            .SingleOrDefault(up => up.Id == userId);

        // If the user doesn't exist, return NotFound
        if (user == null)
        {
            return NotFound();
        }

        // If the user does exsit, move on
        else
        {
            // Check to see if the chore exists
            var chore = _dbContext
                .Chores
                .SingleOrDefault(c => c.Id == id);

            // If the chore doesn't exist, return NotFound
            if (chore == null)
            {
                return NotFound();
            }

            // If the chore does exist, move on
            // 1. build the choreCompletion object
            var choreCompletion = new ChoreCompletion
            {
                UserProfileId = user.Id,
                UserProfile = null,
                ChoreId = chore.Id,
                Chore = null,
                CompletedOn = DateTime.Today
            };

            // 2. save the choreCompletion object
            _dbContext.ChoreCompletions.Add(choreCompletion);
            _dbContext.SaveChanges();

            // 3. return the saved object
            return NoContent();
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateNewChore(Chore chore)
    {
        _dbContext.Chores.Add(chore);
        _dbContext.SaveChanges();

        return Created($"/api/workorder/{chore.Id}", chore);
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateChoreAssignment(int id, [FromQuery] int userId)
    {
        Chore choreToAssign = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile userToAssign = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);

        // Check and make sure the User and Chore passed in exist
        if (choreToAssign == null || userToAssign == null)
        {
            return NotFound();
        }

        // Check and make sure the User and Chore found match the Uesr and Chore passed in
        else if (id != choreToAssign.Id || userId != userToAssign.Id)
        {
            return BadRequest();
        }

        // Build the Object
        ChoreAssignment newChoreAssignment = new ChoreAssignment
        {
            UserProfileId = userId,
            ChoreId = id
        };

        _dbContext.ChoreAssignments.Add(newChoreAssignment);
        _dbContext.SaveChanges();

        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(Chore chore, int id)
    {
        Chore choreToUpdate = _dbContext.Chores.SingleOrDefault(c => c.Id == id);

        if (choreToUpdate == null)
        {
            return NotFound();
        }
        else if (id != choreToUpdate.Id)
        {
            return BadRequest();
        }

        bool isUpdated = true;

        // Update Name
        if (!string.IsNullOrWhiteSpace(chore.Name) && chore.Name != choreToUpdate.Name)
        {
            choreToUpdate.Name = chore.Name.Trim();
            isUpdated = true;
        }

        // Update Difficulty
        if (chore.Difficulty != 0 && chore.Difficulty != choreToUpdate.Difficulty)
        {
            choreToUpdate.Difficulty = chore.Difficulty;
            isUpdated = true;
        }

        // Update Frequency 
        if (chore.ChoreFrequencyDays != 0 && chore.ChoreFrequencyDays != choreToUpdate.ChoreFrequencyDays)
        {
            choreToUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;
            isUpdated = true;
        }

        if (isUpdated)
        {
            _dbContext.SaveChanges();
            return Ok(choreToUpdate);
        }

        else
        {
            return NoContent();
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
        Chore choreToDelete = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        if (choreToDelete == null)
        {
            return NotFound();
        }

        else if (id != choreToDelete.Id)
        {
            return BadRequest();
        }

        _dbContext.Remove(choreToDelete);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChoreAssignment(int id, [FromQuery] int userId)
    {
        Chore choreToUnassign = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile userToUnassign = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);

        // Check and make sure the User and Chore passed in exist
        if (choreToUnassign == null || userToUnassign == null)
        {
            return NotFound();
        }

        // Check and make sure the User and Chore found match the Uesr and Chore passed in
        else if (id != choreToUnassign.Id || userId != userToUnassign.Id)
        {
            return BadRequest();
        }

        // Find the Matching Assignment
        ChoreAssignment choreAssignmentToDelete = _dbContext.ChoreAssignments.SingleOrDefault(ca => ca.UserProfileId == userId && ca.ChoreId == id);

        // Check and make sure the Chore Assignemnt exists
        if (choreAssignmentToDelete == null)
        {
            return NotFound();
        }

        // Check and make sure the User and Chore match the Chore Assignemnt properties
        else if (id != choreAssignmentToDelete.ChoreId || userId != choreAssignmentToDelete.UserProfileId)
        {
            return BadRequest();
        }

        // Remove the Chore Assignment
        _dbContext.Remove(choreAssignmentToDelete);
        _dbContext.SaveChanges();

        return NoContent();
    }
}