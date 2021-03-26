using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Funfic
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }


        [MaxLength(50)]
        public string Genre { get; set; }

        public byte Rating { get; set; }
   
        public int ScoreCount { get; set; }

        [MaxLength(500)]
        public string ShortDescription { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public List<Tag> Tags { get; set; } = new List<Tag>();

        public List<Comment> Comments { get; set; } = new List<Comment>();

        public List<Rating> Ratings { get; set; } = new List<Rating>();

        public List<Chapter> Chapters { get; set; } = new List<Chapter>();
    }
}
