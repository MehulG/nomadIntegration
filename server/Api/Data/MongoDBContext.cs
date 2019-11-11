using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using Microsoft.AspNetCore.Hosting;

namespace Api.Models
{
    public class MongoDBContext : IMongoDBContext
    {
        private IMongoDatabase _database;
        public MongoDBContext() {
            var client = new MongoClient(Environment.GetEnvironmentVariable("DBConnectionString"));
            _database = client.GetDatabase(Environment.GetEnvironmentVariable("DBName"));
        }


        public IMongoDatabase Database() {
            return _database;
        }
        
    }

    public interface IMongoDBContext
    {
        IMongoDatabase Database();
        
    }
}

