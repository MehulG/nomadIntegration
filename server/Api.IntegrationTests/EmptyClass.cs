using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Api.Controllers;
using Api;
using Api.Models;
using System.Net;
using NSuperTest;
using System.Collections.Generic;
using System.Linq;

namespace Api.IntegrationTests
{
    public class EmptyClass
    {




        Server server;

        const string value1 = "value1";
        const string value2 = "value2";

        public EmptyClass()
        {
            server = new Server<Startup>();
        }

        [Fact]
        public void ShouldGiveValues()
        {
            server
                .Get("/api/values")
                .Set("Accept", "application/json")
                .ExpectOk()
                .End<IEnumerable<string>>((r, m) => {
                    Assert.Equal(2, m.Count());
                    Assert.Equal(value1, m.ElementAt(0));
                    Assert.Equal(value2, m.ElementAt(1));
                });

            server
                .Get("/api/values/2")
                .Set("Accept", "application/json")
                .ExpectOk()
                .End<string>((r, m) =>
               {
                   Assert.Equal("value", m);
               });
        }

        //private readonly HttpClient _client;

        //public EmptyClass()
        //{
        //    var appfactory = new WebApplicationFactory<Startup>();
        //    _client = appfactory.CreateClient();
        //}

        //[Fact]

        //public async Task Test1()
        //{
        //    var response = await _client.GetAsync(("api/articles/{id}").Replace("{id}", "3"));
        //    response.StatusCode.Equals(HttpStatusCode.OK);
        //    (await response.Content.ReadAsAsync<Article>()).();
        //}

    }
}
