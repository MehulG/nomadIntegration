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
}
