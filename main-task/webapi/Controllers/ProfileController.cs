using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.Profile;
using webapi.Models.Users;

namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {

        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;


        public ProfileController(AppDbContext appDbContext, UserManager<User> userManager)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            return StatusCode(200, new ProfileResponseModel()
            {
                Name = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phome = user.PhoneNumber,
                Role = await _userManager.IsInRoleAsync(user, "admin") ? "admin" : "user"
            });
        }
    }
}
