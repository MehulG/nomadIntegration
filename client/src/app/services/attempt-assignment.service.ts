import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AttemptAssignmentService {

  constructor(private httpClient:HttpClient) { }

  getFromId(id){
    return this.httpClient.get('http://localhost:5000/Api/Assignment/'+id);
  }
  Post(obj){
    return this.httpClient.post('http://localhost:5000/Api/AttemptAssignment/',obj);
  }
  PutFromIdUid(obj){
    return this.httpClient.put('http://localhost:5000/Api/AttemptAssignment/'+obj.userId+'/'+obj.assignmentId,
     obj);
  }
  getFromIdUid(userid, id){
    return this.httpClient.get('http://localhost:5000/Api/AttemptAssignment/'+userid+'/'+id);
  }
  runPost(uname,repoName,runArr,attemptId){ //hit on nomad microservice
    let data = {
      AttemptId: attemptId,
      FileContent: runArr,
      url: 'https://github.com/'+uname+'/'+repoName+'.git',
      repo: repoName
    }
    console.log(data);
    return this.httpClient.post('http://localhost:5000/api/Job',data);
  }
  samplePost(str){
    return this.httpClient.post('http://localhost:5000/Api/Job',str);
  }
}
