import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  keyword: string;
  movies: any = {};

  subject: BehaviorSubject<any> = new BehaviorSubject(this.movies);

  constructor(private http: HttpClient) { }

  searchResult(keyword: string) {
    console.log('hi');
    var url = 'https://localhost:5001/api/Search?title='+ keyword;
    console.log(url);
    return this.http.get<any>(url);
  }
  filterByTags(tag){
    var tagurl='https://localhost:5001/api/Filter?tags='+tag;
    return this.http.get<any>(tagurl);
  }
}
