import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user;
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var id = this.activatedRoute.snapshot.params['id'];
    console.log(id);

    this.userService.getUserDetails(id).subscribe(
      res => { this.user = res; console.log(res); }
    );
  }
  onSubmit(name, bio) {
    console.log('clicked');
    console.log(name, bio);
    // console.log(this.user.id);

    this.userService.updateUserDetails(this.activatedRoute.snapshot.params['id'],
      {
        id: this.user.id,
        avatar: this.user.avatar,
        userId: this.user.userId,
        name: name,
        email: this.user.email,
        userName: this.user.userName,
        bio: bio,
        articleCount: this.user.articleCount,
        assignmentCount: this.user.assignmentCount,
        showcaseCount: this.user.showcaseCount,
        techStack: this.user.techStack,
        githubAccessToken: this.user.githubAccessToken,
        githubRefreshToken: this.user.githubRefreshToken
      }).subscribe(
        res => {
          console.log("done");
          // console.log(res);
          
          this.router.navigate(["/user/" + this.activatedRoute.snapshot.params['id']]);

        }
      );

  }
  onFileChanged(event) {
    const file = event.target.files[0];
    console.log(file);
  }


}
