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
using webapi.Models.Users;

namespace webapi.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;


        public UsersController(AppDbContext appDbContext, UserManager<User> userManager)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetUsers()
        {
            var name = User.Identity.Name;
            var admins = await _userManager.GetUsersInRoleAsync("admin");
            return StatusCode(200, _userManager.Users.AsEnumerable().Select(user =>
                new UsersResponseModel() { 
                    Id = user.Id,
                    Name = user.UserName, 
                    Email = user.Email,
                    Role = admins.Any(admin => admin.UserName == user.UserName) ? "admin" : "user" ,
                    IsBanned = user.IsBanned
                }
            ));
        }

        [HttpPost("Change")]
        public async Task<IActionResult> ChangeRole([FromBody] UsersRequestModel usersRequest)
        {
            var user = await _userManager.FindByIdAsync(usersRequest.Id);
            if (await _userManager.IsInRoleAsync(user, "admin"))
            {

                await _userManager.AddToRoleAsync(user, "user");
                await _userManager.RemoveFromRoleAsync(user, "admin");
            }
            else
            {
                await _userManager.AddToRoleAsync(user, "admin");
                await _userManager.RemoveFromRoleAsync(user, "user");
            }

            var admins = await _userManager.GetUsersInRoleAsync("admin");
            return StatusCode(200, _userManager.Users.AsEnumerable().Select(user =>
                new UsersResponseModel()
                {
                    Id = user.Id,
                    Name = user.UserName,
                    Email = user.Email,
                    Role = admins.Any(admin => admin.UserName == user.UserName) ? "admin" : "user",
                    IsBanned = user.IsBanned
                }
            ));
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteUser([FromBody] UsersRequestModel usersRequest)
        {
            await _userManager.DeleteAsync(await _userManager.FindByIdAsync(usersRequest.Id));
            var admins = await _userManager.GetUsersInRoleAsync("admin");
            return StatusCode(200, _userManager.Users.AsEnumerable().Select(user =>
                new UsersResponseModel()
                {
                    Id = user.Id,
                    Name = user.UserName,
                    Email = user.Email,
                    Role = admins.Any(admin => admin.UserName == user.UserName) ? "admin" : "user",
                    IsBanned = user.IsBanned
                }
            ));
        }

        [HttpPost("Ban")]
        public async Task<IActionResult> BanUser([FromBody]UsersRequestModel usersRequest)
        {
            var user = await _userManager.FindByIdAsync(usersRequest.Id);
            user.IsBanned = !user.IsBanned;
            await _userManager.UpdateAsync(user);
            var admins = await _userManager.GetUsersInRoleAsync("admin");
            return StatusCode(200, _userManager.Users.AsEnumerable().Select(user =>
                new UsersResponseModel()
                {
                    Id = user.Id,
                    Name = user.UserName,
                    Email = user.Email,
                    Role = admins.Any(admin => admin.UserName == user.UserName) ? "admin" : "user",
                    IsBanned = user.IsBanned
                }
            ));
        }
    }
}
