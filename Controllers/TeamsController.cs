using Microsoft.AspNetCore.Mvc;

namespace hackateam.Controllers;

public class TeamsController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}