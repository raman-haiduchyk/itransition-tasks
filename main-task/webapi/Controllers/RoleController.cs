using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.DbModels;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoleController : Controller
    {
        RoleManager<IdentityRole> _roleManager;
        UserManager<User> _userManager;

        public RoleController(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<int> Index()
        {
            //await _userManager.AddToRoleAsync(await _userManager.FindByNameAsync("1"), "admin");
            return 1;
        }
    }
}
