using System.ComponentModel.DataAnnotations;
using HouseRules.ModelsDTOs;

namespace HouseRules.Models.DTOs;

public class ChoreDTO
{
    public int Id { get; set; }
    [MaxLength(100, ErrorMessage = "Chore names must be 100 characters or less")]
    public string Name { get; set; }
    [Range(1, 5)]
    public int Difficulty { get; set; }
    [Range(1, 14)]
    public int ChoreFrequencyDays { get; set; }
    public List<ChoreCompletionDTO>? ChoreCompletions { get; set; }
    public List<ChoreAssignmentDTO>? ChoreAssignments { get; set; }
}