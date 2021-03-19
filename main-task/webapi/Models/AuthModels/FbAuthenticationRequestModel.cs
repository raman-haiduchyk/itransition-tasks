using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.ActionModels
{
    public class FbAuthenticationRequestModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        public string Id { get; set; }

        [Required]
        public string AuthToken { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }
    }
}
