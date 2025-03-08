using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;

namespace hackateam.Dtos.Team;

public class TeamQueryDto : PaginationQueryDto
{
    [FromQuery]
    public string? Name { get; set; } 

    [FromQuery]
    public string? LeadId { get; set; }

    [FromQuery]
    public string? HackathonName { get; set; }

    [FromQuery]
    public TeamStatus? Status { get; set; }
}