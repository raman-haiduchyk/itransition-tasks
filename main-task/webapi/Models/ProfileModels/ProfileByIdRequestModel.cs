using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.ProfileModels
{
    public class ProfileByIdRequestModel
    {
        [Required]
        public string Id { get; set; }
    }
}
