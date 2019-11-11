using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using MongoDB.Driver;

namespace Api.Services
{
    public class UserService: IUserService
    {
        private readonly IMongoCollection<User> _collection;

        public UserService(IMongoDBContext context)
        {
            _collection = context.Database().GetCollection<User>("User");
        }

        public List<User> Get() =>
            _collection.Find(c => true).ToList();

        public User Get(string id) =>
            _collection.Find<User>(c => c.Id == id).FirstOrDefault();
        
        public User GetByUserId(string userid) =>
            _collection.Find<User>(c => c.UserId == userid).FirstOrDefault();
            
        // public User GetUserByEmail(string email) =>
        //     _collection.Find<User>(c => c.Email == email).FirstOrDefault();
        
        
        public User GetUserByUsername(string username) =>
            _collection.Find<User>(c => c.UserName == username).FirstOrDefault();

        public User Create(User c)
        {
            _collection.InsertOne(c);
            return c;
        }

        public void Update(string id, User _dataIn) =>
            _collection.ReplaceOne(c => c.Id == id,_dataIn);


        public void UpdateAccessToken(string id, string token) => 
            _collection.FindOneAndUpdate(
                c => c.Id == id,
                Builders<User>.Update.Set("GithubAccessToken", token)
            );


       // public void Remove(User _dataIn) =>
         //   _collection.DeleteOne(c => c.Id == _dataIn.Id);

        public void Remove(string id) =>
            _collection.DeleteOne(c => c.Id == id);

    }


    public interface IUserService
    {
        List<User> Get();

        User Get(string id);
        User GetByUserId(string userid);

        User Create(User c);

        void Update(string id, User _dataIn);

       // void Remove(User _dataIn);

        void Remove(string id);

    }
}



