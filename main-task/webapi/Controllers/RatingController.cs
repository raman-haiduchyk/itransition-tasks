using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.DbModels;
using webapi.Models.RatingModels;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingController : Controller
    {

        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;

        public RatingController(UserManager<User> userManager, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _appDbContext = appDbContext;

        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetTags()
        {
            var tags = _appDbContext.Tags.Select(tag => tag.Name);
            return StatusCode(200, tags);
        }

        [Authorize]
        [HttpPost("myrating")]
        public async Task<IActionResult> GetMyRating(RatingRequestModel ratingRequest)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name); ;
            var rating = _appDbContext.Ratings
                .FirstOrDefault(rating => rating.UserId == user.Id && rating.FunficId == ratingRequest.Id);

            if (rating == null) return StatusCode(200, new { rating = 0 });

            return StatusCode(200, new { rating = rating.StarsCount });
        }

        [HttpPost("comments")]
        public async Task<IActionResult> GetComments(RatingRequestModel commentsRequest)
        {
            var comments = _appDbContext.Comments
                .Where(comment => comment.FunficId == commentsRequest.Id)
                .Join(_appDbContext.Users,
                    c => c.UserId,
                    u => u.Id,
                    (c, u) => new
                    {
                        author = u.UserName,
                        text = c.Text,
                        createdAt = c.Date
                    });

            return StatusCode(200, comments);
        }

        [Authorize]
        [HttpPost("rating")]
        public async Task<IActionResult> SetRating(SetRatingRequestModel ratingRequest)
        {
            var funfic = _appDbContext.Funfics.FirstOrDefault(f => f.Id == ratingRequest.Id);

            if (ratingRequest.Stars > 5 || ratingRequest.Stars < 1) return StatusCode(400, "Wrong Stars Count");

            if (funfic == null) return StatusCode(404, "No such funfic");

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var rating = _appDbContext.Ratings
                .FirstOrDefault(rating => rating.FunficId == ratingRequest.Id && rating.UserId == user.Id);

            byte newRating = funfic.Rating;

            if (rating == null)
            {
                await _appDbContext.Ratings.AddAsync(new Rating
                {
                    FunficId = ratingRequest.Id,
                    StarsCount = (byte)ratingRequest.Stars,
                    UserId = user.Id
                });

                byte currentRating = funfic.Rating;
                int currentCount = funfic.ScoreCount;

                newRating = (byte)((currentRating * currentCount + ratingRequest.Stars) / (currentCount + 1));

                funfic.ScoreCount++;
                funfic.Rating = newRating;
            } 
            else
            {
                byte prevStarsCount = rating.StarsCount;
                newRating = (byte)((funfic.Rating * funfic.ScoreCount + ratingRequest.Stars - prevStarsCount) / funfic.ScoreCount);
                funfic.Rating = newRating;
                rating.StarsCount = (byte)ratingRequest.Stars;
            }

            try
            {
                _appDbContext.SaveChanges();
            }
            catch
            {
                return StatusCode(409);
            }

            return StatusCode(200, new { rating = newRating });

        }

        [Authorize]
        [HttpPost("createcomment")]
        public async Task<IActionResult> CreateComment(CreateCommentRequestModel createCommentRequest)
        {
            var funfic = _appDbContext.Funfics.FirstOrDefault(f => f.Id == createCommentRequest.Id);
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (funfic == null) return StatusCode(404, "No such funfic");

            var date = DateTime.Now;

            await _appDbContext.Comments.AddAsync(new Comment
            {
                FunficId = createCommentRequest.Id,
                UserId = user.Id,
                Text = createCommentRequest.Text,
                Date = date
            });

            try
            {
                _appDbContext.SaveChanges();
            }
            catch
            {
                return StatusCode(409);
            }

            return StatusCode(200, new
            {
                author = user.UserName,
                text = createCommentRequest.Text,
                createdAt = date
            });
        }
    }
}
