using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.FunficsModels
{
    public class PartialChapter
    {

        public string Id { get; set; }

        [Required(ErrorMessage = "Required funficId")]
        public string FunficId { get; set; }

        [Required(ErrorMessage = "Required number")]
        public int Number { get; set; }

        [Required(ErrorMessage = "Required name")]
        public string Name { get; set; }

        public string Text { get; set; }

    }
}
