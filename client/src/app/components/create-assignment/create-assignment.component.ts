import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CreateAssignmentService } from 'src/app/services/create-assignment.service';
import { map } from "lodash";
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}




@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']
})




export class CreateAssignmentComponent implements OnInit {




  // accessToken;
  children;
  options = {};
  static modal_flag: boolean = false;
  constructor(
    private createAssignmentService: CreateAssignmentService,
    private httpClient: HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.httpClient.get('https://localhost:5001/Api/User/5db6f16a8dcb3137b022b075')
  }


  // editorOptions = { theme: 'vs-dark', language: 'javascript' };
  //code: string = 'function x() {\nconsole.log("Hello World");\n}';

  editorOptions = { theme: 'vs-dark', language: 'python', readOnly:true };
  code: string = '';

  display(obj) {
    if (obj.type == 'file') {
      let url = obj.url;
      console.log(url);

      this.createAssignmentService.getraw(url).subscribe(
        res => {
          console.log(res);
          this.code = res;
        }

      );
    } else {
      if (obj.children.length == 0) {
        obj.child.subscribe(a => {
          obj.children.push(a);
        });
      }

    }
  }





  repo = "";

  tree = [];
  gettree() {
    this.createAssignmentService.getFolder('Abhishekism9450', this.repo).subscribe(
      res => {
        var arr = Array.from(res);
        res.forEach(element => {
          console.log(element.type);
          // if(element.type == 'dir'){
          //   // console.log("1");
          //   // console.log(element._links.git);
          //   this.gettree(this.url+element.path+this.clientid);
          // }
          this.pushTree({
            path: element.path,
            type: element.type,
            name: element.name,
            url: element.download_url
          })
        });
        // console.log(Array.from(res));
      }
    )
  }
  pushTree(obj) {
    var flag = 0;
    this.tree.forEach(element => {
      if (element.path == obj.path) {
        flag = 1;
      }
    });
    if (flag == 0) {
      this.tree.push(obj);
      console.log(this.tree);
      this.tree.sort(function (a, b) {
        if (a.path < b.path) {
          return -1;
        } else {
          return 1;
        }
      });
    }

  }
  getchild(path) {
    this.createAssignmentService.getFolder('Abhishekism9450', this.repo, path).subscribe(
      //    this.httpClient.get<any>(this.url+path+this.clientid).subscribe(
      res => {
        var arr = Array.from(res);
        res.forEach(element => {
          console.log(element.type);
          // if(element.type == 'dir'){
          //   // console.log("1");
          //   // console.log(element._links.git);
          //   this.gettree(this.url+element.path+this.clientid);
          // }
          this.pushTree({
            path: element.path,
            type: element.type,
            name: element.name,
            url: element.download_url
          })
        });
        // console.log(Array.from(res));
      }
    )
  }

hidden = [];
  hide(path){
    if(!this.hidden.includes(path)){
    this.hidden.push(path);
      console.log(path);
      document.getElementById(path).classList.add("hide");
  }

  }

  save(){
    var content = {
      hidden: this.hidden,
      Uname:  "Abhishekism9450",
      repo: this.repo,
      title: this.title
    };
    console.log(content);
    this.createAssignmentService.post(content);
    
  }

title;
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!CreateAssignmentComponent.modal_flag){
      console.log(CreateAssignmentComponent.modal_flag);
      console.log('The dialog was closed');
      console.log(result);
      this.repo = result.repo;
      this.title = result.title;
      this.tree = [];
      this.gettree();
      CreateAssignmentComponent.modal_flag = false;
    }
      
    });
  }
}
@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      CreateAssignmentComponent.modal_flag = true;
      this.dialogRef.close();

    }

}