using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models
{
    public class User: IdentityUser
    {
        public string RefreshToken { get; set; }

        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsBanned { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
