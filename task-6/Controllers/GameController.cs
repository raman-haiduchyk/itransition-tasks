using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace task_6.Controllers
{
    public class GameController : Controller
    {
        private class Tag
        {
            public string Value { get; set; }
        }



        [HttpPost]
        public ActionResult Index(string gamename, string tags)
        {
            Tag[] deserializedTags = JsonConvert.DeserializeObject<Tag[]>(tags);
            ViewBag.Creator = new string[] { "ha", "haha" };
            return View();
        }



        [HttpGet]
        public ActionResult Index(string id)
        {
            return View();
        }
    }



}