using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.Profile
{
    public class ProfileResponseModel
    {
        public string Name { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Phome { get; set; }

        public string Role { get; set; }
    }
}
