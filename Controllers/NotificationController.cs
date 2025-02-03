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


    public NotificationController(NotificationService notificationService, UserService userService)
    {
        _notificationService = notificationService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<List<NotificationResponseDto>>> Get()
    {
        var notifications = await _notificationService.GetAll();
        return await Task.FromResult(notifications.Select(notification => new NotificationResponseDto(notification)).ToList());
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<NotificationResponseDto>> Get(string id)
    {
        return await Task.FromResult(Ok(new NotificationResponseDto(await _notificationService.Get(notification => notification.Id == id))));
    }

    [HttpPost]
    public async Task<ActionResult<NotificationResponseDto>> Create(CreateNotificationDto createNotificationDto)
    {

        var user = await _userService.Get(user => user.Id == createNotificationDto.UserId);
        if (user == null)
        {
            return await Task.FromResult(NotFound(Constants.UserMessage.NOT_FOUND));
        }

        var notification = await _notificationService.Create(createNotificationDto);
        return await Task.FromResult(CreatedAtAction(nameof(Get), new { id = notification.Id }, new NotificationResponseDto(notification)));
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<NotificationResponseDto>> Update(string id, UpdateNotificationDto updateNotificationDto)
    {
        var notification = await _notificationService.Get(notification => notification.Id == id);
        if (notification == null)
        {
            return await Task.FromResult(NotFound(Constants.NotificationMessage.NOT_FOUND));
        }

        if (updateNotificationDto.UserId != null)
        {
            var user = await _userService.Get(user => user.Id == updateNotificationDto.UserId);
            if (user == null)
            {
                return await Task.FromResult(NotFound(Constants.UserMessage.NOT_FOUND));
            }
        }

        await _notificationService.Update(notification => notification.Id == id, updateNotificationDto);
        return await Task.FromResult(Ok(new NotificationResponseDto(notification)));
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<ActionResult> Delete(string id)
    {
        var notification = await _notificationService.Get(notification => notification.Id == id);
        if (notification == null)
        {
            return await Task.FromResult(NotFound(Constants.NotificationMessage.NOT_FOUND));
        }

        await _notificationService.Remove(notification => notification.Id == id);
        return await Task.FromResult(Ok(new NotificationResponseDto(notification)));
    }
}
