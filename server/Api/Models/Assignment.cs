using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Assignment
    {
        [BsonId]
        [BsonIgnoreIfDefault]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string UserName { get; set; }

        public string[] Hidden { get; set; }
        public List<ReadOnlyPart> ReadOnly { get; set; }

        public string Repo { get; set; }

        public string Title { get; set; }

        public string[] Tags { get; set; }

        public Boolean Publish { get; set; }

        public class ReadOnlyPart
        {
            public string Path { get; set; }
            public List<ReadOnlyRange> ReadOnlyRanges { get; set; }

            public class ReadOnlyRange
            {
                public int StartLine { get; set; }
                public int StartColumn {get; set;}
                public int EndLine { get; set; }
                public int EndColumn {get; set;}
            }
        }

    }



    public class AssignmentUpdateModel {
        public string[] Hidden { get; set; }
        public List<Assignment.ReadOnlyPart> ReadOnly { get; set; }
        public Boolean Publish {get; set;}
    }

    // public class CreateAssignmentModel 
    // {
    //     public string Id {get; set;}
    //     public string Title {get; set;}
    //     public string[] Tags {get; set;}
    //     public string UserName {get; set;} 
    //     public string Repo { get; set; }
    // }


}
