using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models.DTOs;

public class ChoreCompletionDTO
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public int ChoreId { get; set; }
    public DateTime MyProperty { get; set; }
}