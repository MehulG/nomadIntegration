import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import{ UserService} from './../../services/user.service'
////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-user-details',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserDetailsComponent implements OnInit {

  Articles = [];
  Assignments = [];
  Showcase = [];
  user;
  UserActictivity;
  Tech = [];
  constructor(private httpClient: HttpClient, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var id = this.activatedRoute.snapshot.params['id'];
    console.log(id);
    console.log("oninit");
    this.userService.getUserDetails(id).subscribe(
      res => { this.user = res; console.log("aaaaaa", res); this.Tech = res.techStack}
    );
    this.userService.getAssignmentCreated(id).subscribe(
      res => {this.Assignments = res}
    );
    this.userService.getArticleCreated(id).subscribe(
      res => {
        console.log(res);
        this.Articles = res;
        res.forEach(element => {
          console.log(element);
          JSON.parse(element.content).ops.forEach(element1 => {
            console.log(element1.insert.image);
            var img;
            if (element1.insert.image != undefined) {
              img = element1.insert.image;
              this.Articles[this.Articles.indexOf(element)].image = img;
            }
            // if (element1.insert.substring(0, 5) == 'image') {
            //   console.log(element1.insert.substring(0, 5));
            // }
          });
        });
      }
    )
    // this.userService.getUserDetails(id).subscribe(
    //   res => console.log('aaa')
    // )
    // this.userService.getUserActivity(id).subscribe(
    //   res => {
    //     this.UserActictivity = res;
    //     // console.log("aaa",res);

    //     res.articleCreated.forEach(element => {
    //       this.userService.getArticleCreated(element).subscribe(
    //         res => {
    //           this.Articles.push(res);
    //           console.log(res);
    //         }
    //       );
    //     });
    //     res.assignmentCreated.forEach(element => {
    //       this.userService.getAssignmentCreated(element).subscribe(
    //         res => {
    //           this.Assignments.push(res);
    //           console.log(res);
    //         }
    //       );
    //     });

    //     console.log(res);
    //   }
    // );
    // this.httpClient.get("http://localhost:5000/Api/User/"+"5db12d04f3d45d0888aa616e").subscribe(
    //   res => {that.user = res; console.log("a");
    //   }
    // );
  }
  edit() {
    this.router.navigate(["/editUser/" + this.activatedRoute.snapshot.params['id']]);
  }
}
