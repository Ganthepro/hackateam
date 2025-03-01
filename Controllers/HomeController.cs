using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using hackateam.Models;

namespace hackateam.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Register()
    {
        return View();
    }

    public IActionResult Login()
    {
        return View();
    }

    public IActionResult Intro()
    {
        return View();
    }

    public IActionResult Explore()
    {
        return View();
    }

        public IActionResult Teamlist()
    {
        return View();
    }

    public IActionResult CreateTeam()
    {
        return View();
    }

    public IActionResult HostedTeamManagement()
    {
        return View();
    }

    public IActionResult Notification()
    {
        return View();
    }

    public ActionResult TeamInfo(string id)
    {
        ViewBag.Id = id; 
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
