import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  getUserDetails(id):Observable<any>{
    return this.httpClient.get('https://localhost:5001/api/User/'+id);
  }
  getUserActivity(userid):Observable<any>{
    return this.httpClient.get('https://localhost:5001/Api/useractivity/'+userid);
  }
  updateUserDetails(id, content):Observable<any>{
    return this.httpClient.put('https://localhost:5001/api/User/'+id, content);
  }
  getArticleCreated(id):Observable<any>{
    return this.httpClient.get('http://localhost:5000/Api/Article/user/'+id);
  }
  getAssignmentCreated(id):Observable<any>{
    return this.httpClient.get('http://localhost:5000/Api/Assignment/user/'+id);
  }

}
