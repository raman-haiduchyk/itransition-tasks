using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.RatingModels
{
    public class SetRatingRequestModel
    {

        [Required]
        public string Id { get; set; }


        [Required]
        public int Stars { get; set; }
    }
}
