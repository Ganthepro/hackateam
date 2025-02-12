using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;

namespace hackateam.Dtos.Team;

public class TeamQueryDto : PaginationQueryDto
{
    [FromQuery]
    public string? Name { get; set; }  // Filter by Team Name

    [FromQuery]
    public string? LeadName { get; set; }  // Filter by Lead Name

    [FromQuery]
    public string? HackathonName { get; set; }  // Filter by Hackathon Name

    [FromQuery]
    public TeamStatus? Status { get; set; }  // Filter by Team Status
}