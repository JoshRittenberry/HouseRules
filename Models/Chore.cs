using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models;

public class Chore
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public int Difficutly { get; set; }
    [Required]
    public int ChoreFrequencyDays { get; set; }
}