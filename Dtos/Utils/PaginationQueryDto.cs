using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace hackateam.Dtos.Utils;

public class PaginationQueryDto
{
    [FromQuery, Range(1, Int16.MaxValue)]
    public Int16 Page { get; set; } = 1;

    [FromQuery, Range(1, Int16.MaxValue)]
    public Int16 Limit { get; set; } = 10;
}