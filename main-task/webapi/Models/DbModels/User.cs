using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class User: IdentityUser
    {

        [MaxLength(255)]
        public string RefreshToken { get; set; }

        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsBanned { get; set; }

        [MaxLength(50)]
        public string FirstName { get; set; }


        [MaxLength(50)]
        public string LastName { get; set; }

        public List<Funfic> Funfics { get; set; } = new List<Funfic>();

        public List<Comment> Comments { get; set; } = new List<Comment>();

        public List<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
