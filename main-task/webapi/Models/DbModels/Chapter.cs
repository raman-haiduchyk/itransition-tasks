using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Chapter
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string FunficId { get; set; }

        [Required]
        public int Number { get; set; }

        [MaxLength(50)]
        [Required]
        public int Name { get; set; }

        public string Text { get; set; }

    }
}
