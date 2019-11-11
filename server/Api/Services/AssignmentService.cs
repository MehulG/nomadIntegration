using System.Collections.Generic;
using System.Linq;
using Api.Models;
using MongoDB.Driver;


namespace Api.Services
{
    public class AssignmentService: IAssignmentService
    {
        private readonly IMongoCollection<Assignment> _collection;

        public AssignmentService(IMongoDBContext context)
        {
            _collection = context.Database().GetCollection<Assignment>("Assignment");
            
        }

        public List<Assignment> Get() =>
            _collection.Find(c => true).ToList();
        public Assignment Get(string id) =>
            _collection.Find<Assignment>(c => c.Id == id).FirstOrDefault();

        public List<Assignment> GetByAuthor(string author) =>
            _collection.Find<Assignment>(c => c.UserName == author).ToList();

        public Assignment Create(Assignment c)
        {
            _collection.InsertOne(c);
            return c;
        }


        public UpdateResult Publish(string id) {
            // var assignment = this.Get(id);
            
            return _collection.UpdateOne(
                a => a.Id == id,
                Builders<Assignment>.Update.Set("Publish", true)
            );
        }

        public UpdateResult UnPublish(string id) {
            return _collection.UpdateOne(
                a => a.Id == id,
                Builders<Assignment>.Update.Set("Publish", false)
            );
        }

        public void Update(string id, Assignment _dataIn) =>
            _collection.ReplaceOne(c => c.Id == id,_dataIn);


        public UpdateResult UpdatePermissions(string id, AssignmentUpdateModel _dataIn) => 
            _collection.UpdateOne(
                c => c.Id == id,
                Builders<Assignment>.Update.Set("Hidden", _dataIn.Hidden)
                    .Set("ReadOnly", _dataIn.ReadOnly)
            );

       // public void Remove(Assignment _dataIn) =>
        //    _collection.DeleteOne(c => c.Id == _dataIn.Id);

        public void Remove(string id) =>
            _collection.DeleteOne(c => c.Id == id);

    }


    public interface IAssignmentService
    {
        List<Assignment> Get();

        List<Assignment> GetByAuthor(string author);

        Assignment Get(string id);


        Assignment Create(Assignment c);

        void Update(string id, Assignment _dataIn);

        UpdateResult UpdatePermissions(string id, AssignmentUpdateModel _dataIn);
        UpdateResult Publish(string id);
        UpdateResult UnPublish(string id);
        

       // void Remove(Assignment _dataIn);

        void Remove(string id);

    }
}



