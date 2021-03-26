using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Rating
    {
        public string UserId { get; set; }

        public User User { get; set; }

        public string FunficId { get; set; }

        public Funfic Funfic { get; set; }

        public byte StarsCount { get; set; }
    }
}
