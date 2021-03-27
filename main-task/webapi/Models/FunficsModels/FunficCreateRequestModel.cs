﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.FunficsModels
{
    public class FunficCreateRequestModel
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
    }
}
