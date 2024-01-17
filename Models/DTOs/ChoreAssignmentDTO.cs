using HouseRules.Models.DTOs;

namespace HouseRules.ModelsDTOs;

public class ChoreAssignmentDTO
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public int ChoreId { get; set; }
    public ChoreDTO Chore { get; set; }
}