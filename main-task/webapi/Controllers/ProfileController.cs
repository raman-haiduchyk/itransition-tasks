using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.DbModels;
using webapi.Models.ProfileModels;
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

        [HttpGet("myprofile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return StatusCode(404, "No such user");
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

        [Authorize(Roles = "admin")]
        [HttpPost("profilebyid")]
        public async Task<IActionResult> GetProfileById(ProfileByIdRequestModel requestModel)
        {
            var user = await _userManager.FindByIdAsync(requestModel.Id);
            if (user == null) return StatusCode(404, "No such user");
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

        [HttpPost("changeprofile")]
        public async Task<IActionResult> ChangeProfile(ProfileResponseModel requestModel)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return StatusCode(404, "No such user");
            user.FirstName = requestModel.FirstName;
            user.LastName = requestModel.LastName;
            user.PhoneNumber = requestModel.Phome;
            user.Email = requestModel.Email;
            try
            {
                await _userManager.UpdateAsync(user);
            }
            catch
            {
                return StatusCode(409);
            }

            return StatusCode(200);
        }
    }
}
