using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace task_4.Models
{
    public class UserModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public bool Is_Blocked { get; set; }

        public DateTime Reg_Date { get; set; }

        public DateTime Login_Date { get; set; }
    }
}
