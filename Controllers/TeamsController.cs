using Microsoft.AspNetCore.Mvc;

namespace hackateam.Controllers;

public class TeamsController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Create()
    {
        return View();
    }

    public IActionResult Edit()
    {
        return View();
    }

    public ActionResult Info(string id)
    {
        ViewBag.Id = id; 
        return View();
    }
}