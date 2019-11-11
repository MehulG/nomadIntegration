using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System;
using System.IO;


namespace Api.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult login(string returnUrl = "http://localhost:4200/assignment/new")
        {
            return Challenge(new AuthenticationProperties() { RedirectUri = returnUrl });
        }

        public IActionResult callback()
        {

            // if(HttpContext.User.Identity.IsAuthenticated) {
            //     Console.WriteLine("Authenticated");
            // } else {
            //     Console.WriteLine("Not Authenticated");
            // }

            return Ok("hi");
        }

        public async Task<IActionResult> Logout()
        {
            // await _signInManager.SignOutAsync();
            return Redirect("http://localhost:4200");
        }
    }
}