using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Jwt;
using webapi.Models;
using webapi.Models.ActionModels;

namespace webapi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class TokenController : Controller
    {
        readonly UserManager<User> _userManager;
        readonly JwtHandler _jwtHandler;

        public TokenController(UserManager<User> _userManager, JwtHandler _jwtHandler)
        {
            this._userManager = _userManager;
            this._jwtHandler = _jwtHandler;
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return Unauthorized("Invalid client request");
            }

            string accessToken = tokenModel.AccessToken;
            string refreshToken = tokenModel.RefreshToken;

            var principal = _jwtHandler.GetPrincipalFromExpiredToken(accessToken);

            var user = await _userManager.FindByNameAsync(principal.Identity.Name);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return Unauthorized("Invalid tokens");
            }

            var newAccessToken = await _jwtHandler.GenerateAccessToken(user);
            var newRefreshToken = _jwtHandler.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(15);

            await _userManager.UpdateAsync(user);

            return StatusCode(200, new TokenModel { AccessToken = newAccessToken, RefreshToken = newRefreshToken});
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public async Task<IActionResult> Revoke()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return BadRequest();
            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);
            return Ok();
        }
    }
}
