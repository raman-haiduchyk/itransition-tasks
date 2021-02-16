// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(function () {
    $("#checkAll").click(function () {
        if ($("#checkAll").prop("checked")) {
            $(".check").prop("checked", true);
        }
        else {
            $(".check").prop("checked", false);
        }
    });
});