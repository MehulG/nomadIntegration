import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    data;
    constructor(private httpClient: HttpClient) { }
    public get(): Observable<any> {
        // console.log(this.httpClient.get(`https://localhost:5001/api/Article`));
        return this.httpClient.get(`https://localhost:5001/api/Article`);
    }
   
    public addArticle(article): Observable<any> {
        return this.httpClient.post("https://localhost:5001/api/Article/",article)
    }
    public getArticleByID(id):Observable<any>{
        return this.httpClient.get(`https://localhost:5001/api/Article/`+ id)
    }
    public updateArticle(id,article):Observable<any>{
        return this.httpClient.put(`https://localhost:5001/api/Article/` + id, article)
    }
    public qwerty(id):Observable<any>{
        return this.httpClient.get(`https://localhost:5001/api/Search/articles/user/` + id)
    }
}