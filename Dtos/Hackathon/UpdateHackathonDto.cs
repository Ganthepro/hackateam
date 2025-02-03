using System.ComponentModel.DataAnnotations;

namespace hackateam.Dtos.Hackathon
{
    public class UpdateHackathonDto
    {
        public string? Name { get; set; }

        public string? Location { get; set; }

        public string? Description { get; set; }
    }
}
