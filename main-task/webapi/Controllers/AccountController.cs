using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using webapi.Jwt;
using webapi.Models.DbModels;
using webapi.Models.AuthModels;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;

        public AccountController(UserManager<User> userManager, IMapper mapper, JwtHandler jwtHandler)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
        }

        [HttpGet()]
        public int Index()
        {
            return 1;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationRequestModel userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.UserName);
            if (user == null)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "No such user" });
            if (!await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "Wrong password" });
            if (user.IsBanned)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "User is banned" });

            var tokens = await _jwtHandler.GenerateTokensForUser(user);

            return Ok(new AuthenticationResponseModel { IsAuthSuccessful = true, Tokens = tokens });
        }

        [HttpPost("GoogleExternalLogin")]
        public async Task<IActionResult> GoogleExternalLogin([FromBody] ExternalAuthenticationRequestModel externalAuth)
        {
            var payload = await _jwtHandler.VerifyGoogleToken(externalAuth);
            if (payload == null)
                return Unauthorized("Invalid External Authentication.");

            var user = await signUserWithExternal(payload.Subject, payload.Name, payload.Email, externalAuth.Provider);

            if (user == null)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "Authentication error" });
            if (user.IsBanned)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "User is banned" });

            var tokens = await _jwtHandler.GenerateTokensForUser(user);

            return Ok(new AuthenticationResponseModel { IsAuthSuccessful = true, Tokens = tokens });
        }

        [HttpPost("FbExternalLogin")]
        public async Task<IActionResult> FbExternalLogin([FromBody] FbAuthenticationRequestModel externalAuth)
        {
            if (! await _jwtHandler.VerifyFacebookToken(externalAuth.AuthToken))
                return Unauthorized("Invalid External Authentication.");

            var user = await signUserWithExternal(externalAuth.Id, externalAuth.Name, externalAuth.Email, externalAuth.Provider);

            if (user == null)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "Authentication error" });
            if (user.IsBanned)
                return StatusCode(401, new AuthenticationResponseModel { ErrorMessage = "User is banned" });

            var tokens = await _jwtHandler.GenerateTokensForUser(user);

            return Ok(new AuthenticationResponseModel { IsAuthSuccessful = true, Tokens = tokens });

        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegistrationRequestModel userRegistrationModel)
        {
            if (userRegistrationModel == null || !ModelState.IsValid)
            {
                var errors = from value in ModelState.Values
                             from error in value.Errors
                             select error.ErrorMessage;
                return BadRequest(new RegistrationResponseModel { Errors = errors });
            }

            var user = _mapper.Map<User>(userRegistrationModel);

            var result = await _userManager.CreateAsync(user, userRegistrationModel.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new RegistrationResponseModel { Errors = errors });
            }

            await _userManager.AddToRoleAsync(await _userManager.FindByNameAsync(user.UserName), "user");

            return StatusCode(201, new RegistrationResponseModel { IsSuccessfulRegistration = true });
        }

        private async Task<User> signUserWithExternal(string id, string name, string email, string provider)
        {
            var info = new UserLoginInfo(provider, id, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new User { Email = email, UserName = name };
                    await _userManager.CreateAsync(user);
                    await _userManager.AddLoginAsync(user, info);
                    await _userManager.AddToRoleAsync(await _userManager.FindByNameAsync(user.UserName), "user");
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                }
            }
            return user;
        }
    }
}
