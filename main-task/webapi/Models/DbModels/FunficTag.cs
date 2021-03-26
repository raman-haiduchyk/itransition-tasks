using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class FunficTag
    {
        public string FunficsId { get; set; }

        public string TagsId { get; set; }

        public Funfic Funfic { get; set; }
        public Tag Tag { get; set; }
    }
}
