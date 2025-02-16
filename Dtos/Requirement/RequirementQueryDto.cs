using System.ComponentModel.DataAnnotations;
using hackateam.Dtos.Utils;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;

namespace hackateam.Dtos.Requirement;

public class RequirementQueryDto : PaginationQueryDto
{

    [FromQuery]
    public string? TeamId { get; set; }

}