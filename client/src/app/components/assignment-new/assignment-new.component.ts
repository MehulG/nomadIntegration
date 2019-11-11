import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAssignmentService } from 'src/app/services/create-assignment.service';
import { GithubRepoService } from 'src/app/services/github-repo.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assignment-new',
  templateUrl: './assignment-new.component.html',
  styleUrls: ['./assignment-new.component.css']
})
export class AssignmentNewComponent implements OnInit {
  basicFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;

  repos: any[] = [];
  username: string = 'kaustubhkagrawal';
  filteredRepos: Observable<any[]>;
  tree: any[] = [];

  tags: string[] = [];
  visible: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private _formBuilder: FormBuilder,
    private assignmentService: CreateAssignmentService,
    private githubService: GithubRepoService, 
    private route: Router
  ) { }

  ngOnInit() {
    this.basicFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.firstFormGroup = this._formBuilder.group({
      repo: ['', Validators.required],
      username: [this.username, Validators.required]
    });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });


    this.githubService.getRepos(this.username)
      // .subscribe(data => console.log(data));
      .subscribe(data => this.repos = data);

    this.filteredRepos = this.firstFormGroup.controls.repo.valueChanges
      // this.filteredRepos = this.firstFormGroup.get('repo')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }


  private _filter(value: string): string[] {
    // console.log('hi')
    const filterValue = value.toLowerCase();
    console.log(this.repos)
    let results = this.repos.filter(repo => {
      // console.log(repo);
      return repo.name.toLowerCase().includes(filterValue);
    });
    console.log(results);
    return results;
  }


  treeUpdate(tree: any[]) {
    this.tree = tree;
  }


  display(obj) {
    if (obj.type == 'file') {
      let url = obj.url;
      console.log(url);

      // this.assignmentService.getraw(url).subscribe(
      //   res => {
      //     console.log(res);
      //     // this.code = res;
      //   }

      // );
    } else {
      if (obj.children.length == 0) {
        obj.child.subscribe(a => {
          obj.children.push(a);
        });
      }

    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      if(this.tags.indexOf(value.trim()) < 0) {
        this.tags.push(value.trim());
        this.basicFormGroup.controls.tags.setValue(this.tags.toString());
      }
    }
    if (input) {
      input.value = '';
    }
    // console.log(this.basicFormGroup.value);

  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.basicFormGroup.controls.tags.setValue(this.tags.toString());
    }

  }


  createAssignment() {
    let assignment = {
      userName: this.firstFormGroup.value.username,
      repo: this.firstFormGroup.value.repo,
      title: this.basicFormGroup.value.title,
      tags: this.basicFormGroup.value.tags.split(','),
      publish: false
    }
    this.assignmentService.create(assignment)
      .subscribe(res => {
        this.route.navigate(['/assignment/edit/'+res.id]);
      });
  }




}
