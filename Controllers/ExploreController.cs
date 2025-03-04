using Microsoft.AspNetCore.Mvc;

namespace hackateam.Controllers;

public class ExploreController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}