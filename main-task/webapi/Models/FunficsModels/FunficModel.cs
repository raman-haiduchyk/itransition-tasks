using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models.DbModels;

namespace webapi.Models.FunficsModels
{
    public class FunficModel
    {
        public string Id { get; set; }
        public string Author { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }
        public string ShortDescription { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public byte Rating { get; set; }
        public int ScoreCount { get; set; }
        public DateTime CreatedAt { get; set; }

        public IEnumerable<PartialChapter> Chapters { get; set; }
    }
}
