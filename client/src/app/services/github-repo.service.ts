import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubRepoService {
  private access_token = '440fc5c22177d9966d5cce0b4cb7124eab48eddb';
  private _url : string = "https://raw.githubusercontent.com/yenchiah/project-website-template/master/css/controls.css"
  constructor(private http: HttpClient) { }

  getCode():Observable<any>{
    return this.http.get(this._url);
  }

  getRepos(username: string):Observable<any> {
    // return this.http.get(`https://api.github.com/users/${ username }/repos?client_id=${ environment.GITHUB_API_CLIENT_ID }`);
    return this.http.get(`https://api.github.com/users/${ username }/repos?access_token=${ this.access_token }`);
  }

}
