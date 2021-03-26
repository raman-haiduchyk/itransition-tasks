﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.DbModels
{
    public class Tag
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }


        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        public List<Funfic> Funfics { get; set; }
    }
}
