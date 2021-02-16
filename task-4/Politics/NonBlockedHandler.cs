using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using task_4.Models;

namespace task_4.Politics
{
    public class NonBlockedHandler : AuthorizationHandler<NonBlockedRequirment>
    {
        private AppDbContext _db;

        public NonBlockedHandler(AppDbContext appDbContext)
        {
            _db = appDbContext;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
            NonBlockedRequirment requirement)
        {
            ClaimsPrincipal user = context.User;
            if (user.HasClaim(c => c.Type == ClaimTypes.Name))
            {
                string email = context.User.FindFirstValue(ClaimsIdentity.DefaultNameClaimType);
                if (await requirement.Pass(_db, email)) context.Succeed(requirement);
            }
        }
    }
}
