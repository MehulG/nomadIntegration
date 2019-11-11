using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("Api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;


        public UserController(IUserService service)
        {
            _service = service;
         
        }

     
        [HttpGet]
        public ActionResult<List<User>> Get() =>
          Ok(_service.Get());

        [HttpGet("{id:length(24)}", Name = "GetUser")]
        public ActionResult<User> Get(string id)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;//dfsdfsdfsdf
        }


        // [Authorize]
        // [HttpGet("me", Name = "GetProfile")]
        // public ActionResult<User> Get()
        // {
        //     string id = HttpContext.Users.Claims.Where(c => c.Type == "id").Value;
            

        //     var entities = _service.Get(id);

        //     if (entities == null)
        //     {
        //         return NotFound();
        //     }

        //     return entities;//dfsdfsdfsdf
        // }

        [HttpGet("{userid:length(24)}")]
        public ActionResult<User> GetByUserId(string userid)
        {
            var entities = _service.GetByUserId(userid);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;//dfsdfsdfsdf
        }
        
        [HttpPost]
        public ActionResult<User> Create(User entities)
        {
            _service.Create(entities);

            return CreatedAtRoute("GetUser", new { id = entities.Id.ToString() }, entities);

        }
        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, User entitiesIn)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            _service.Update(id, entitiesIn);

            return Ok(NoContent());
        }
        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            _service.Remove(entities.Id);

            return Ok(NoContent());
        }

    }
}