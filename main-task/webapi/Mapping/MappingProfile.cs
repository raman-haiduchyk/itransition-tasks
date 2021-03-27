﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.AuthModels;
using webapi.Models.DbModels;
using webapi.Models.FunficsModels;

namespace webapi.Mapping
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<RegistrationRequestModel, User>();
            CreateMap<Chapter, PartialChapter>();
        }
    }
}
