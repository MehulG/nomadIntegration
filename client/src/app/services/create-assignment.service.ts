import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, of, Observable } from 'rxjs';
import { map, concatMap, tap, flatMap, switchMap } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';



// export class TreeNode {
//   name: string;
//   children: string[];
// }


@Injectable({
  providedIn: 'root'
})
export class CreateAssignmentService {

  private access_token = '440fc5c22177d9966d5cce0b4cb7124eab48eddb';
  


  contents: any[] = []
  contentSubject: BehaviorSubject<any[]> = new BehaviorSubject(this.contents);

  constructor(
    private http: HttpClient
  ) { }

  // transform(a: TreeNode) {
  //   return {
  //     name: a.name,
  //     children: (a.children == null)?[]:a.children
  //   }
  // }

  getFolder(username: string, repo: string, path: string = ''){
  //  console.log("fhgjhkj");
    return this.http.get<any>(`https://api.github.com/repos/${username}/${ repo }/contents/${ path }?access_token=${ this.access_token }`)
    // return this.http.get<any>(`https://api.github.com/repos/${username}/${ repo }/contents/${ path }?client_id=${ environment.GITHUB_API_CLIENT_ID }`)
 }

  getFolderTree(username: string, repo: string, path: string = ''){
  
    // let a: any;
    // let subject = new BehaviorSubject(a);

    let content: any;
  //  return this.http.get<any>(`https://api.github.com/repos/${username}/${ repo }/contents/${ path }?client_id=${ environment.GITHUB_API_CLIENT_ID }`)
    return this.http.get<any>(`https://api.github.com/repos/${username}/${ repo }/contents/${ path }?access_token=7369e24e4b5496207309254b3f6005e450b79423`)

      .pipe(
        concatMap((a) => {
          // console.log(a);
          let source = from(a);
          return source.pipe(
            map((data:any) => {
              if(data.type == 'dir') {
                data.child = this.getFolderTree(username, repo, `${path}/${data.name}`)
                  // .subscribe(b => data.children = b);
                data.children = [];
              }
              // console.log(data);
              return data;
            })
          );
        })
      );

    // return subject;
    
  }
  getraw(url){
    console.log(url);
    
    return this.http.get(url,
      {responseType: 'text'})
    
  }
  post(obj){
    this.http.post("http://localhost:5000/api/Assignment",obj).subscribe(
     
      res => console.log("saved in db")
      
    );
  }

  edit(id, obj) {
    return this.http.put(`${ environment.apiUrl }/assignment/${ id }`, obj);
  }

  getAssignment(id: string): Observable<any> {
    return this.http.get(`${ environment.apiUrl }/assignment/${id}`);
  }

  create(obj): Observable<any> {
    console.log(obj);
    return this.http.post("http://localhost:5000/api/assignment",obj)
  }
}
