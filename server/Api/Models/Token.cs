using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Token
    {
        [BsonId]
        [BsonIgnoreIfDefault]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        public string AppName {get; set;}
        public string Token { get; set; }
    }

}
