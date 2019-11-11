using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Api.Controllers;
using Api;
using Api.Models;
using System.Net;

namespace Api.IntegrationTests
{
    public class UnitTest1
    {

        private readonly HttpClient _client;

        public UnitTest1()
        {
            var appfactory = new WebApplicationFactory<Startup>();
            _client = appfactory.CreateClient();
        }

        [Fact]

        public async Task Test1()
        {
            var response = await _client.GetAsync(("api/articles/{id}").Replace("{id}","2"));
            response.StatusCode.Equals(HttpStatusCode.OK);
            //(await response.Content.ReadAsAsync<Article>()).Should.BeEmpty();
        }

    }
}
