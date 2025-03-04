using Microsoft.AspNetCore.Mvc;

namespace hackateam.Controllers;

public class NotificationsController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}