using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.FunficsModels
{
    public class FunficByIdRequestModel
    {
        [Required(ErrorMessage = "Id is required")]
        public string Id { get; set; }
    }
}
