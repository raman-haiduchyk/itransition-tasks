using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Funfic
    {
        public string Id { get; set; }

        public List<Tag> Tags { get; set; } = new List<Tag>();

        public List<Comment> Comments { get; set; } = new List<Comment>();

        public List<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
