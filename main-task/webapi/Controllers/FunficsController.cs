using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using webapi.Models.DbModels;
using webapi.Models.FunficsModels;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FunficsController : Controller
    {

        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public FunficsController(UserManager<User> userManager, IMapper mapper, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _appDbContext = appDbContext;
            
        }

        [Authorize]
        [HttpPost("change")]
        public async Task<IActionResult> Change([FromBody] FunficModel funfic)
        {
            var role = User.Claims
                .FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");

            if (funfic.Author != User.Identity.Name && role.Value != "admin") return StatusCode(403);

            // try to find funfic and attach chapters and tags from db
            var existingFunfic = _appDbContext.Funfics
                .Include(f => f.Chapters)
                .Include(f => f.Tags)
                .FirstOrDefault(f => f.Id == funfic.Id);

            if (existingFunfic == null) return StatusCode(404, "No such funfic existing");

            var owner = await _userManager.FindByNameAsync(funfic.Author);
            if (owner == null || existingFunfic.UserId != owner.Id) return StatusCode(403);
            if (!funfic.Chapters.All(chapter => chapter.FunficId == existingFunfic.Id)) return StatusCode(400);

            // delete unnecessary tags
            existingFunfic.Tags
                .FindAll(tag => !funfic.Tags.Any(t => t == tag.Name))
                .ForEach(tag => existingFunfic.Tags.Remove(tag));

            // creating new tags and adding them to funfic
            funfic.Tags
                .Where(tag => !existingFunfic.Tags.Any(t => t.Name == tag))
                .ToList()
                .ForEach(tag =>
                {
                    existingFunfic.Tags.Add(new Tag() { Name = tag });                
                });

            //deleting unnecessary chapters
            existingFunfic.Chapters
               .FindAll(chapter => !funfic.Chapters.Any(c => c.Id == chapter.Id))
               .ForEach(chapter => existingFunfic.Chapters.Remove(chapter));

            // editing or creating chapters
            funfic.Chapters
                .ToList()
                .ForEach(chapter =>
                {
                    var chapterIndex = existingFunfic.Chapters.FindIndex(c => c.Id == chapter.Id && chapter.Id != null);
                    if (chapterIndex != -1)
                    {
                        existingFunfic.Chapters[chapterIndex].Name = chapter.Name;
                        existingFunfic.Chapters[chapterIndex].Text = chapter.Text;
                        existingFunfic.Chapters[chapterIndex].Number = chapter.Number;
                    }
                    else
                    {
                        existingFunfic.Chapters.Add(new Chapter
                        {
                            Name = chapter.Name,
                            Number = chapter.Number,
                            Text = chapter.Text
                        });
                    }

                });

            existingFunfic.Name = funfic.Name;
            existingFunfic.ShortDescription = funfic.ShortDescription;
            existingFunfic.Genre = funfic.Genre;

            try
            {
                _appDbContext.SaveChanges();
            }
            catch
            {
                return StatusCode(409, "Update error.");
            }

            return StatusCode(200);
        }

        [Authorize]
        [HttpGet("getmy")]
        public async Task<IActionResult> GetMy()
        {
            var id = (await _userManager.FindByNameAsync(User.Identity.Name)).Id;

            var funfics = _appDbContext.Funfics
                .Include(f => f.Chapters)
                .Include(f => f.Tags)
                .Where(f => f.UserId == id)
                .Join(_appDbContext.Users,
                    f => f.UserId,
                    u => u.Id,
                    (f, u) => new PartialFunficModel
                    {
                        Id = f.Id,
                        Author = u.UserName,
                        Name = f.Name,
                        Genre = f.Genre,
                        ShortDescription = f.ShortDescription,
                        Tags = f.Tags.Select(t => t.Name),
                        Rating = f.Rating,
                        ScoreCount = f.ScoreCount,
                        CreatedAt = f.CreatedAt
                    });
            if (funfics == null) return StatusCode(404, "No funfics");
            return StatusCode(200, funfics);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("getbyid")]
        public async Task<IActionResult> GetByUserId([FromBody] FunficByIdRequestModel getRequestModel)
        {
            var role = User.Claims
                .FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");

            var funfics = _appDbContext.Funfics
                .Include(f => f.Chapters)
                .Include(f => f.Tags)
                .Where(f => f.UserId == getRequestModel.Id)
                .Join(_appDbContext.Users,
                    f => f.UserId,
                    u => u.Id,
                    (f, u) => new PartialFunficModel
                    {
                        Id = f.Id,
                        Author = u.UserName,
                        Name = f.Name,
                        Genre = f.Genre,
                        ShortDescription = f.ShortDescription,
                        Tags = f.Tags.Select(t => t.Name),
                        Rating = f.Rating,
                        ScoreCount = f.ScoreCount,
                        CreatedAt = f.CreatedAt
                    });
            if (funfics == null) return StatusCode(404, "No funfics");
            return StatusCode(200, funfics);
        }

        [HttpPost("get")]
        public async Task<IActionResult> GetById([FromBody] FunficByIdRequestModel getRequestModel)
        {
            var funfic = _appDbContext.Funfics
                .Include(f => f.Chapters)
                .Include(f => f.Tags)
                .Join(_appDbContext.Users,
                    f => f.UserId,
                    u => u.Id,
                    (f, u) => new FunficModel
                    {
                        Id = f.Id,
                        Author = u.UserName,
                        Name = f.Name,
                        Genre = f.Genre,
                        ShortDescription = f.ShortDescription,
                        Tags = f.Tags.Select(t => t.Name),
                        Rating = f.Rating,
                        ScoreCount = f.ScoreCount,
                        CreatedAt = f.CreatedAt,
                        Chapters = f.Chapters.Select(chap => _mapper.Map<PartialChapter>(chap))
                    })
                .Single(f => f.Id == getRequestModel.Id);
            if (funfic == null) return StatusCode(404, "No such funfic.");
            return StatusCode(200, funfic);
        }


        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var funfics = _appDbContext.Funfics.Join(_appDbContext.Users,
                f => f.UserId,
                u => u.Id,
                (f, u) => new PartialFunficModel
                {
                    Id = f.Id,
                    Author = u.UserName,
                    Name = f.Name,
                    Genre = f.Genre,
                    ShortDescription = f.ShortDescription,
                    Tags = f.Tags.Select(t => t.Name),
                    Rating = f.Rating,
                    ScoreCount = f.ScoreCount,
                    CreatedAt = f.CreatedAt
                });

            return StatusCode(200, funfics);
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody]FunficCreateRequestModel createRequestModel)
        {
            var funfic = new Funfic()
            {
                Name = createRequestModel.Name,
                CreatedAt = DateTime.Now,
                UserId = (await _userManager.FindByNameAsync(User.Identity.Name)).Id
            };
            var task = await _appDbContext.AddAsync(funfic);

            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch
            {
                return StatusCode(409);
            }

            return StatusCode(201, task.Entity.Id);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("createbyid")]
        public async Task<IActionResult> CreateById([FromBody] FunficCreateByIdRequestModel createRequestModel)
        {
            var funfic = new Funfic()
            {
                Name = createRequestModel.Name,
                CreatedAt = DateTime.Now,
                UserId = createRequestModel.Id
            };
            var task = await _appDbContext.AddAsync(funfic);

            try
            {
                await _appDbContext.SaveChangesAsync();
            } 
            catch
            {
                return StatusCode(409);
            }
            
            return StatusCode(201, task.Entity.Id);
        }

        [Authorize]
        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] FunficByIdRequestModel deleteRequestModel)
        {
            var role = User.Claims
                .FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");

            var existingFunfic = _appDbContext.Funfics
                .FirstOrDefault(f => f.Id == deleteRequestModel.Id);

            if (existingFunfic == null) return StatusCode(404, "No such funfic existing");

            var owner = await _userManager.FindByNameAsync(existingFunfic.UserId);

            if (role.Value != "admin" && User.Identity.Name != owner.UserName) return StatusCode(403);

            _appDbContext.Funfics.Remove(existingFunfic);

            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch
            {
                return StatusCode(409);
            }

            return StatusCode(200);
        }
    }
}
