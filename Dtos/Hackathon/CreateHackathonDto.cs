using System.ComponentModel.DataAnnotations;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace hackateam.Dtos.Hackathon
{
    public class CreateHackathonDto
    {
        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Location { get; set; }

        [Required]
        public string? Description { get; set; }
    }
}