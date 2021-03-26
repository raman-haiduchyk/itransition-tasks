using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Tag
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public List<Funfic> Funfics { get; set; }
    }
}
