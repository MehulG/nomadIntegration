using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using MongoDB.Driver;

namespace Api.Services
{
    public class TokenService: ITokenService
    {
        private readonly IMongoCollection<Token> _collection;

        public TokenService(IMongoDBContext context)
        {
            _collection = context.Database().GetCollection<Token>("Token");
        }

        public List<Token> Get() =>
            _collection.Find(c => true).ToList();

        public Token Get(string id) =>
            _collection.Find<Token>(c => c.Id == id).FirstOrDefault();
        
        public Token GetByUserId(string userId) =>
            _collection.Find<Token>(c => c.UserId == userId).FirstOrDefault();

        public Token Create(Token c)
        {
            _collection.InsertOne(c);
            return c;
        }

        public void Update(string id, Token _dataIn) =>
            _collection.ReplaceOne(c => c.Id == id,_dataIn);


        // public void UpdateAccessToken(string id, string token) => 
        //     _collection.FindOneAndUpdate(
        //         c => c.Id == id,
        //         Builders<Token>.Update.Set("GithubAccessToken", token)
        //     );


       // public void Remove(Token _dataIn) =>
         //   _collection.DeleteOne(c => c.Id == _dataIn.Id);

        public void Remove(string id) =>
            _collection.DeleteOne(c => c.Id == id);

    }


    public interface ITokenService
    {
        List<Token> Get();

        Token Get(string id);
        Token GetByUserId(string userId);

        Token Create(Token c);

        void Update(string id, Token _dataIn);

       // void Remove(Token _dataIn);

        void Remove(string id);

    }
}



