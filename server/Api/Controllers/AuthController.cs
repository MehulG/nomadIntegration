using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System;
using System.IO;


namespace Api.Controllers
{
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [Route("login")]
        public IActionResult login(string returnUrl = "http://localhost:4200/dashboard")
        {
            return Challenge(new AuthenticationProperties() { RedirectUri = returnUrl });
        }

        [Route("callback")]
        public IActionResult callback()
        {

            // if(HttpContext.User.Identity.IsAuthenticated) {
            //     Console.WriteLine("Authenticated");
            // } else {
            //     Console.WriteLine("Not Authenticated");
            // }

            return Ok("hi");
        }

        // [Route("")]
        // public async Task<IActionResult> Logout()
        // {
        //     // await _signInManager.SignOutAsync();
        //     return Redirect("http://localhost:4200");
        // }
    }
}