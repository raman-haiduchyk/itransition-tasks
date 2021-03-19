using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models.ActionModels
{
    public class AuthenticationResponseModel
    {
        public bool IsAuthSuccessful { get; set; }

        public string ErrorMessage { get; set; }

        public TokenModel Tokens { get; set; }
    }
}
