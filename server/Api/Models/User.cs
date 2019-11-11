using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class User
    {
        [BsonId]
        [BsonIgnoreIfDefault]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string UserId{get; set;}
        // public string Email { get; set; }

        public string UserName {get; set;}

        public string[] Article {get; set;}

        public string[] Assignment {get; set;}
        public string GithubAccessToken {get; set;}
        public string GithubRefreshToken {get; set;}

    }

    public class GithubUserResponse {
        public string login {get; set;}
        public int id {get; set;}
        public string avatar_url {get; set;}
    }

}
