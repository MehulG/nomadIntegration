using System;
using Xunit;
using Api.Controllers;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using Api.Models;
using System.Collections.Generic;

namespace Api.Tests
{
    public class ArticleTest
    {
        ArticleController _controller;
        IArticleService _service;

        public ArticleTest()
        {
            _service = new ArticleFake();
            _controller = new ArticleController(_service);
        }

        [Fact]
        public void Get_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.Get();

            // Assert
            Assert.IsType<OkObjectResult>(okResult.Result);
        }
        [Fact]
        public void Get_WhenCalled_ReturnsAllItems()
        {
            // Act
            var okResult = _controller.Get().Result as OkObjectResult;

            // Assert
            var items = Assert.IsType<List<Article>>(okResult.Value);
            Assert.Equal(4, items.Count);

        }
        [Fact]
        public void Remove_ExistingPassed_ReturnsOkResult()
        {
            // Arrange
            var existingGuid = "1234";

            // Act
            var okResponse = _controller.Delete(existingGuid);

            // Assert
            Assert.IsType<OkObjectResult>(okResponse);
        }
        [Fact]
        public void Update_ExistingPassed_ReturnsOkResult()
        {
            // Arrange
            var existingGuid = "1234";
            Article cd = new Article()
            {
                Title = "Abhishek",
                Tags = "create a new repo",
                Content = "This is Spartans !!!"
            };
            // Act
            var okResponse = _controller.Update(existingGuid, cd);

            // Assert
            Assert.IsType<OkObjectResult>(okResponse);
        }

    }
}
