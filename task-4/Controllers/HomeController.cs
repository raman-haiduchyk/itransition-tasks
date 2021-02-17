using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Action(string action, int[] id)
        {
            const string block = "Block", unblock = "Unblock", delete = "Delete";
            switch (action)
            {
                case block:
                    await Block(id, true);
                    break;
                case delete:
                    await Delete(id);
                    break;
                case unblock:
                    await Block(id, false);
                    break;
            }

            return RedirectToAction("Index", "Home");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [NonAction]
        private async Task Delete(int[] id)
        {
            _db.TestUsers.RemoveRange(_db.TestUsers.AsEnumerable().Where(u => id.Contains(u.Id)));
            await _db.SaveChangesAsync();
        }

        [NonAction]
        private async Task Block(int[] id, bool flag)
        {
            IEnumerable<UserModel> users = _db.TestUsers.AsEnumerable().Where(u => id.Contains(u.Id));
            foreach (var user in users) user.Is_Blocked = flag;
            _db.UpdateRange(users);
            await _db.SaveChangesAsync();
        }
    }
}
