using System.Collections.Generic;
using System.Web.Mvc;
using Newtonsoft.Json;
using task_6.Models;

namespace task_6.Controllers
{
    public class GameController : Controller
    {
       

        [HttpPost]
        public ActionResult Index(string gamename, string tags)
        {
            Tag[] deserializedTags = JsonConvert.DeserializeObject<Tag[]>(tags);
            List<string> tagValues = new List<string>();
            foreach (var tag in deserializedTags) tagValues.Add(tag.Value);
            ViewBag.Creator = gamename;
            ViewBag.Tags = tagValues;
            return View();
        }



        [HttpGet]
        public ActionResult Index(string id)
        {
            ViewBag.Id = id;
            return View();
        }
    }



}