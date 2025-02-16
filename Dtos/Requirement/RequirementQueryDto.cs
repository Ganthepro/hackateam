using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;

namespace hackateam.Dtos.Requirement;

public class RequirementQueryDto : PaginationQueryDto
{

    [FromQuery, Length(24, 24)]
    public string? TeamId { get; set; }

}