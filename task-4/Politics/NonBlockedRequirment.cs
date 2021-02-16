using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using task_4.Models;

namespace task_4.Politics
{
    public class NonBlockedRequirment: IAuthorizationRequirement
    {
        public async Task<bool> Pass(AppDbContext db, string email)
        {
            return await Task.FromResult(!(await db.TestUsers.FirstOrDefaultAsync(u => u.Email == email)).Is_Blocked);
        }

    }
}
