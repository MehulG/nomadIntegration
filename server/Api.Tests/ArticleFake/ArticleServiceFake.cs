using Api.Models;
using Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Api.Tests
{
    public class ArticleFake : IArticleService
    {
        private readonly List<Article> _Article;

        public ArticleFake()
        {
            _Article = new List<Article>()
            {
                new Article(){
                    Id="123", Title="MehulG", Tags="create a new repo", Content= "This is good" },
                new Article(){
                    Id="1234", Title="MehulGG", Tags="create a new repoo", Content= "This is goodd" },
                new Article(){
                    Id="12345", Title="MehulGGG", Tags="create a new repooo", Content= "This is gooddd" },
                new Article(){
                    Id="123456", Title="MehulGGGG", Tags="create a new repoooo", Content= "This is goodddd" },

            };
        }

        public List<Article> Get()
        {
            return _Article;
        }

        public Article Get(string id)
        {
            return _Article.Where(a => a.Id == id)
           .FirstOrDefault();
        }
        public Article Create(Article newItem)
        {
            newItem.Id = "134527282";
            _Article.Add(newItem);
            return newItem;
        }
        public void Update(string id, Article bookIn)
        {

        }

        public void Remove(string id)
        {

        }

    }
}
