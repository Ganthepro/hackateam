using Microsoft.AspNetCore.Mvc;
using hackateam.Services;
using hackateam.Dtos.Notification;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace hackateam.Controllers;
[ApiController]
[Route("[controller]")]
[Authorize]
public class NotificationController : Controller
{
    private readonly NotificationService _notificationService;
    private readonly UserService _userService;
    private readonly TeamService _teamService;

    public NotificationController(NotificationService notificationService, UserService userService, TeamService teamService)
    {
        _notificationService = notificationService;
        _userService = userService;
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<List<NotificationResponseDto>>> Get()
    {
        var notifications = await _notificationService.GetAll();
        var notificationDtos = new List<NotificationResponseDto>();
        foreach (var notification in notifications)
        {
            var user = await _userService.Get(user => user.Id == notification.UserId);
            var team = await _teamService.Get(team => team.Id == notification.TeamId);
            notificationDtos.Add(new NotificationResponseDto(notification, user, team));
        }
        return Ok(notificationDtos);
    }


    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<NotificationResponseDto>> Get(string id)
    {
        var notification = await _notificationService.Get(notification => notification.Id == id);
        if (notification == null)
        {
            return NotFound(Constants.NotificationMessage.NOT_FOUND);
        }

        var user = await _userService.Get(user => user.Id == notification.UserId);
        var team = await _teamService.Get(team => team.Id == notification.TeamId);

        return Ok(new NotificationResponseDto(notification, user, team));
    }

    [HttpPost]
    public async Task<ActionResult<NotificationResponseDto>> Create(CreateNotificationDto createNotificationDto)
    {
        var user = await _userService.Get(user => user.Id == createNotificationDto.UserId);
        if (user == null)
        {
            return NotFound(Constants.UserMessage.NOT_FOUND);
        }

        var team = await _teamService.Get(team => team.Id == createNotificationDto.TeamId);
        if (team == null)
        {
            return NotFound(Constants.TeamMessage.NOT_FOUND);
        }

        var notification = await _notificationService.Create(createNotificationDto);
        return CreatedAtAction(
            nameof(Get),
            new { id = notification.Id },
            new NotificationResponseDto(notification, user, team));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<NotificationResponseDto>> Update(string id, UpdateNotificationDto updateNotificationDto)
    {
        var notification = await _notificationService.Get(notification => notification.Id == id);
        if (notification == null)
        {
            return NotFound(Constants.NotificationMessage.NOT_FOUND);
        }

        if (updateNotificationDto.UserId != null)
        {
            var updatedUser = await _userService.Get(user => user.Id == updateNotificationDto.UserId);
            if (updatedUser == null)
            {
                return NotFound(Constants.UserMessage.NOT_FOUND);
            }
        }

        if (updateNotificationDto.TeamId != null)
        {
            var updatedTeam = await _teamService.Get(team => team.Id == updateNotificationDto.TeamId);
            if (updatedTeam == null)
            {
                return NotFound(Constants.TeamMessage.NOT_FOUND);
            }
        }

        await _notificationService.Update(notification => notification.Id == id, updateNotificationDto);

        // Get updated notification with related data
        var updatedNotification = await _notificationService.Get(notification => notification.Id == id);
        var user = await _userService.Get(user => user.Id == updatedNotification.UserId);
        var team = await _teamService.Get(team => team.Id == updatedNotification.TeamId);

        return Ok(new NotificationResponseDto(updatedNotification, user, team));
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult> Delete(string id)
    {
        var notification = await _notificationService.Get(notification => notification.Id == id);
        if (notification == null)
        {
            return NotFound(Constants.NotificationMessage.NOT_FOUND);
        }

        var user = await _userService.Get(user => user.Id == notification.UserId);
        var team = await _teamService.Get(team => team.Id == notification.TeamId);

        await _notificationService.Remove(notification => notification.Id == id);
        return Ok(new NotificationResponseDto(notification, user, team));
    }
}
