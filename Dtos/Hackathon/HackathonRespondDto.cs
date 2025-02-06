namespace hackateam.Dtos.Hackathon
{
    public class HackathonResponseDto
    {
        public HackathonResponseDto(hackateam.Models.Hackathon hackathon)
        {
            Id = hackathon.Id;
            Name = hackathon.Name;
            Location = hackathon.Location;
            Description = hackathon.Description;
        }

        public string? Id { get; set; }

        public string? Name { get; set; }
        public string? Location { get; set; }

        public string? Description { get; set; }
    }
}