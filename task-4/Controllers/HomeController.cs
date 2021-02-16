using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading.Tasks;
using task_4.Models;

namespace task_4.Controllers
{
    [Authorize(Policy = "NonBlocked")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private AppDbContext _db;

        public HomeController(ILogger<HomeController> logger, AppDbContext appDbContext)
        {
            _logger = logger;
            _db = appDbContext;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _db.TestUsers.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Action(string action, int[] id)
        {
            switch (action)
            {

            }
            return RedirectToAction("Index", "Home");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        
    }
}
