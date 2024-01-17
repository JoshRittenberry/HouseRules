using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models;

public class ChoreAssignment
{
    public int Id { get; set; }
    [Required]
    public int UserProfileId { get; set; }
    [Required]
    public int ChoreId { get; set; }
}