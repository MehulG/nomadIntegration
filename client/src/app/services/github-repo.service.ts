import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubRepoService {
  private _url : string = "https://raw.githubusercontent.com/yenchiah/project-website-template/master/css/controls.css"
  constructor(private http: HttpClient) { }

  getCode():Observable<any>{
    return this.http.get(this._url);
  }
}
