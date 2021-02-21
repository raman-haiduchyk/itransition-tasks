﻿using System.Web;
using System.Web.Optimization;

namespace task_6
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/signalR").Include(
                      "~/Scripts/jquery.signalR-2.2.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/handlebars").Include(
                      "~/Scripts/handlebars.js"));

            bundles.Add(new ScriptBundle("~/bundles/tagify").Include(
                      "~/Scripts/tagify.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-tagify").Include(
                      "~/Scripts/jQuery.tagify.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/tagify.css"));
        }
    }
}
