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

  getFolder(username: string, repo: string, path: string = '') {
    //  console.log("fhgjhkj");
    return this.http.get<any>(`https://api.github.com/repos/${username}/${repo}/contents/${path}?client_id=${environment.GITHUB_API_CLIENT_ID}`)
  }

  getFolderTree(username: string, repo: string, path: string = '') {

    let content: any;
    return this.http.get<any>(`https://api.github.com/repos/${username}/${repo}/contents/${path}?client_id=${environment.GITHUB_API_CLIENT_ID}`)
      .pipe(
        concatMap((a) => {
          // console.log(a);
          let source = from(a);
          return source.pipe(
            map((data: any) => {
              if (data.type == 'dir') {
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
  getraw(url) {
    console.log(url);

    return this.http.get(url,
      { responseType: 'text' })

  }
  post(obj) {
    this.http.post("http://localhost:5000/api/Assignment", obj).subscribe(
      res => console.log("saved in db")

    );
  }
}
