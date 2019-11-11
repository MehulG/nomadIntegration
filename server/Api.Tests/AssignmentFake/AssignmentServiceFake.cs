using Api.Models;
using Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Api.Tests.AssignmentFake

{
    public class AssignmentFake : IAssignmentService
    {
        private readonly List<Assignment> _Assignment;

        // public AssignmentFake()
        // {
        //     _Assignment = new List<Assignment>()
        //     {
        //         new Assignment(){
        //             Id="123", Title="MehulG",ProblemStatement="good problem",InputFormat="give me format", OutputFormat="This is output", Constraints="blah !", Tags="create a new repo"},
        //         new Assignment(){
        //             Id="1234", Title="MehulG",ProblemStatement="good problem",InputFormat="give me format", OutputFormat="This is output", Constraints="blah !", Tags="create a new repo"},
        //         new Assignment(){
        //             Id="12345", Title="MehulG",ProblemStatement="good problem",InputFormat="give me format", OutputFormat="This is output", Constraints="blah !", Tags="create a new repo"},
        //     };
        // }

        public List<Assignment> Get()
        {
            return _Assignment;
        }

          public List<Assignment> GetByUserName()
        {
            return _Assignment;
        }

        public Assignment Get(string id)
        {
            return _Assignment.Where(a => a.Id == id)
           .FirstOrDefault();
        }
        public Assignment Create(Assignment newItem)
        {
            newItem.Id = "134527282";
            _Assignment.Add(newItem);
            return newItem;
        }
        public void Update(string id, Assignment bookIn)
        {

        }

        public void Remove(string id)
        {

        }

    }
}
