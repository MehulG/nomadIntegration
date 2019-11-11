using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Api.Controllers
{
    [Route("Api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService _service;


        public TokenController(ITokenService service)
        {
            _service = service;
        }

     
        [HttpGet]
        public ActionResult<List<Token>> Get() => {
            string id = HttpContext.User.Claims.Where(c => c.Type = "id").FirstOrDefault().Value;
            return Ok(_service.GetByUserId(id));
        }

        [HttpGet("{id:length(24)}", Name = "GetToken")]
        public ActionResult<Token> Get(string id)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;//dfsdfsdfsdf
        }

        
        [HttpPost]
        public ActionResult<Token> Create(Token entities)
        {
            _service.Create(entities);

            return CreatedAtRoute("GetToken", new { id = entities.Id.ToString() }, entities);

        }


        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Token entitiesIn)
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