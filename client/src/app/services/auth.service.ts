import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*"  , 
    "Access-Control-Allow-Headers": "X-Requested-With"
  })

  login() {
    return this.http.get('https://github.com/login/oauth/authorize', {headers: {
      "Access-Control-Allow-Origin": "*"  
    }})
      .subscribe(data => console.log(data));
  }

}
