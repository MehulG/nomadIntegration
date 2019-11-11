using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("Api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _service;


        public AssignmentController(IAssignmentService service)
        {
            _service = service;
         
        }

     
        [HttpGet]
        public ActionResult<List<Assignment>> Get() =>
          Ok(_service.Get());

        [HttpGet("{id:length(24)}", Name = "GetAssignment")]
        public ActionResult<Assignment> Get(string id)
        {

            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;//dfsdfsdfsdf
        }
        [HttpGet("{username}")]
        public ActionResult<List<Assignment>> GetByAuthor(string username)
        {

            var entities = _service.GetByAuthor(username);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;
        }

        [HttpPost]
        public ActionResult<Assignment> Create(Assignment entities)
        {
            
            _service.Create(entities);

            return CreatedAtRoute("GetAssignment", new { id = entities.Id.ToString() }, entities);

        }
        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, AssignmentUpdateModel entitiesIn)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            if(entities.Publish == false) {

                return Ok(_service.UpdatePermissions(id, entitiesIn));
            }
            return Ok(entities);
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