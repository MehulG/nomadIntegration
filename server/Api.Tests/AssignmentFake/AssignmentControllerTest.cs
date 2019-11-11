using System;
using Xunit;
using Api.Controllers;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using Api.Models;
using System.Collections.Generic;

namespace Api.Tests.AssignmentFake
{
    public class AssignmentTest
    {
        AssignmentController _controller;
        IAssignmentService _service;

        public AssignmentTest()
        {
            _service = new AssignmentFake();
            _controller = new AssignmentController(_service);
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
            var items = Assert.IsType<List<Assignment>>(okResult.Value);
            Assert.Equal(3, items.Count);

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
            Assignment cd = new Assignment()
            {
                Title = "Abhishek",
                Tags = "create a new repo",
                ProblemStatement = "This is Spartans !!!",
                InputFormat="asdd",
                OutputFormat="qwerty",
                Constraints="shvjac",
            };
            // Act
            var okResponse = _controller.Update(existingGuid, cd);

            // Assert
            Assert.IsType<OkObjectResult>(okResponse);
        }

    }
}
