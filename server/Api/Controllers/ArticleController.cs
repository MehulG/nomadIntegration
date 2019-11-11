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
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _service;


        public ArticleController(IArticleService service)
        {
            _service = service;
         
        }

     
        [HttpGet]
        public ActionResult<List<Article>> Get() =>
          Ok(_service.Get());

        [HttpGet("{id:length(24)}", Name = "GetArticle")]
        public ActionResult<Article> Get(string id)
        {
            var entities = _service.Get(id);

            if (entities == null)
            {
                return NotFound();
            }

            return entities;//dfsdfsdfsdf
        }
        
        [HttpPost]
        public ActionResult<Article> Create(Article entities)
        {
            _service.Create(entities);

            return CreatedAtRoute("GetArticle", new { id = entities.Id.ToString() }, entities);

        }
        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Article entitiesIn)
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