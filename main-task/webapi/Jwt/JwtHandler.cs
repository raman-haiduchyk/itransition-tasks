using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.AuthModels;
using webapi.Models.DbModels;

namespace webapi.Jwt
{
    public class JwtHandler
    {
        private readonly IConfigurationSection _jwtSettings;
        private readonly IConfigurationSection _goolgeSettings;
        private readonly IConfigurationSection _facebookSettings;
        private readonly UserManager<User> _userManager;
        private readonly HttpClient _client = new HttpClient();

        public JwtHandler(IConfiguration configuration, UserManager<User> userManager)
        {
            _jwtSettings = configuration.GetSection("JwtSettings");
            _goolgeSettings = configuration.GetSection("GoogleAuthSettings");
            _facebookSettings = configuration.GetSection("FacebookAuthSettings");
            _userManager = userManager;
        }

        public async Task<bool> VerifyFacebookToken(string token)
        {
            var id = _facebookSettings.GetSection("clientId").Value;
            var secret = _facebookSettings.GetSection("clientSecret").Value;

            var reqString = $"https://graph.facebook.com/oauth/access_token?client_id={id}&client_secret={secret}&grant_type=client_credentials";

            var res = JObject.Parse(await _client.GetStringAsync(reqString));

            if (res.ContainsKey("access_token"))
            {
                reqString = $"https://graph.facebook.com/debug_token?input_token={token}&access_token={res.Value<string>("access_token")}";
                res = JObject.Parse(await _client.GetStringAsync(reqString));
                if (!res.ContainsKey("error")) return true;
            } 
            return false;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalAuthenticationRequestModel externalAuth)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _goolgeSettings.GetSection("clientId").Value }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(externalAuth.IdToken, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }

        public SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.GetSection("securityKey").Value);
            var secret = new SymmetricSecurityKey(key);

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        public async Task<List<Claim>> GetClaims(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, await _userManager.IsInRoleAsync(user, "admin") ? "admin" : "user")
            };

            return claims;
        }

        public JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var tokenOptions = new JwtSecurityToken
            (
                issuer: _jwtSettings.GetSection("validIssuer").Value,
                //audience: _jwtSettings.GetSection("validAudience").Value,
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_jwtSettings.GetSection("expiryInMinutes").Value)),
                signingCredentials: signingCredentials
            );

            return tokenOptions;
        }

        public async Task<string> GenerateAccessToken(User user)
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims(user);
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<TokenModel> GenerateTokensForUser(User user)
        {
            TokenModel tokens = new TokenModel() { AccessToken = await GenerateAccessToken(user), RefreshToken = GenerateRefreshToken() };

            user.RefreshToken = tokens.RefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(15);

            await _userManager.UpdateAsync(user);

            return tokens;
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtSettings.GetSection("validIssuer").Value,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.GetSection("securityKey").Value)),
                ValidateLifetime = false
            };

            SecurityToken securityToken;
            var principal = new JwtSecurityTokenHandler().ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}
