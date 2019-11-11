using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using MongoDB.Driver;

namespace Api.Services
{
    public class ArticleService:IArticleService
    {
        private readonly IMongoCollection<Article> _collection;

        public ArticleService(IMongoDBContext context)
        {
            _collection = context.Database().GetCollection<Article>("Article");
        }

        public List<Article> Get() =>
            _collection.Find(c => true).ToList();

        //public List<Article> Get1() =>
        //   _collection1.Find(c => true).ToList();
        public Article Get(string id) =>
            _collection.Find<Article>(c => c.Id == id).FirstOrDefault();
            
        //  public Article GetByUserId(string userid) =>
        //     _collection.Find<Article>(c => c.UserId == userid).FirstOrDefault();

        public Article Create(Article c)
        {
            _collection.InsertOne(c);
            return c;
        }

        public void Update(string id, Article _dataIn) =>
            _collection.ReplaceOne(c => c.Id == id, _dataIn);

        // public void Remove(Article _dataIn) =>
        //     _collection.DeleteOne(c => c.Id == _dataIn.Id);

        public void Remove(string id) =>
            _collection.DeleteOne(c => c.Id == id);

    }



    public interface IArticleService
    {
        List<Article> Get();

        Article Get(string id);
       // Article GetByUserId(string id);

        Article Create(Article c);

        void Update(string id, Article _dataIn);

       // void Remove(Article _dataIn);

        void Remove(string id);

    }
}
