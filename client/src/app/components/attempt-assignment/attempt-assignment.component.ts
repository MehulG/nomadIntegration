import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttemptAssignmentService } from './../../services/attempt-assignment.service';
import { CreateAssignmentService } from './../../services/create-assignment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attempt-assignment',
  templateUrl: './attempt-assignment.component.html',
  styleUrls: ['./attempt-assignment.component.css']
})
export class AttemptAssignmentComponent implements OnInit{

  constructor(private route: ActivatedRoute, private attemptService: AttemptAssignmentService,
    private createService: CreateAssignmentService, public dialog: MatDialog) { }

  editorOptions = {
    language: 'csharp', readOnly: false, automaticLayout: true,
    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    minimap: {
      enabled: false
    },
    scrollbar: {
      verticalScrollbarSize: 0
    },
    scrollBeyondLastLine: false,
    wordWrap: 'on'
  };
  code: string = "";
  editor;

  
  onInit(editor) {
    console.log(editor.setPosition);
    this.editor = editor;
    var line = editor.getPosition().lineNumber;
    var model = editor.getModel();
    console.log(model);
    console.log(editor.getSelection());
    editor.onDidChangeContent(e => {console.log(e);
    })
  }




  prevCode = "";
  prevObj;
  currentObj;
  assignmentId;
  userId;
  assignment;
  breadcrumb;
  dispTree = [];
  mdpath;
  SaveArray = [];
  treenodes = [];
  content = [];
  prevContent = this.content;
  ngOnInit() {
    this.assignmentId = this.route.snapshot.params['id'];
    this.userId = this.route.snapshot.params['user'];
    console.log(this.assignmentId);
    var response;
    this.attemptService.getFromId(this.assignmentId).subscribe(
      res => {
        // console.log(res);
        this.assignment = res;
        console.log(this.assignment);
        this.attemptService.getFromIdUid(this.userId, this.assignmentId).subscribe(
          res => {
            console.log(res);
            response = res;
            // console.log(res);
            this.SaveArray = response.content;
          },
          err => {
            if (err.status == 404) {
              console.log(404);

              this.attemptService.Post({
                assignmentId: this.route.snapshot.params['id'],
                userId: this.route.snapshot.params['user'],
                content: this.SaveArray
              }).subscribe(res => console.log('created in db')
              )
            }
          }
        )
        this.createService.getFolder(this.assignment.uname, this.assignment.repo).subscribe(
          res => {
            console.log(res);
            res.forEach(element => {
              if (!this.assignment.hidden.includes(element.path)) {
                if (element.name.substr(element.name.length - 3) == '.md' ||
                  element.name.substr(element.name.length - 3) == '.MD' ||
                  element.name.substr(element.name.length - 3) == '.Md') {
                  this.mdpath = element.download_url;
                  console.log("pushed in mdpath");
                  console.log(this.mdpath);
                  
                  
                } else {
                  this.dispTree.push({
                    path: element.path,
                    type: element.type,
                    name: element.name,
                    url: element.download_url
                  })
                }
              }
            });
          }
        )
      }
    )
  }

  saveLocally(obj){
    var flag = this.content[0].editable;
    var lineCount = 0;
    var readOnly = [];
    var fileText = "";
    this.content.forEach(element => {
      fileText += element.text;
      flag = !flag;
      if (flag == true) {
        readOnly.push({
          startLine: lineCount + 1,
          endLine: lineCount + 1 + element.text.split('\n').length
        })
      }
      lineCount = element.text.split('\n').length;
    });
    
    if (this.SaveArray.length == 0) {
      this.SaveArray.push({
        path: obj.path,
        file: fileText,
        nonEdit: readOnly
      });
      console.log(this.SaveArray);
    }
    else {
      var flagPath = 0;
      this.SaveArray.forEach(element => {
        if (element.path == obj.path) {
          if (element.file != fileText) {
            var index = this.SaveArray.indexOf(element);
            this.SaveArray.splice(index, 1, {
              path: obj.path,
              file: fileText,
              nonEdit: readOnly
            });
            console.log(this.SaveArray);
          }
          flagPath = 1;
        } else {
        }
      });
      if (flagPath == 0) {
        this.SaveArray.push({
          path: obj.path,
          file: fileText,
          nonEdit: readOnly
        });
        }

    }
  }

  display(obj) {

    if (obj.type == 'file' && obj != this.currentObj) {
      this.currentObj = obj;
      this.breadcrumb = obj.path;
      if (this.prevContent != this.content) {
        //push in SaveArray
        console.log("trying to save locally");
        
        this.saveLocally(this.prevObj);
        console.log(this.SaveArray);
        

////////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaa      
      // if (this.prevCode != this.code) {
      //   //push in SaveArray
      //   if (this.SaveArray.length == 0) {
      //     this.SaveArray.push({
      //       path: this.prevObj.path,
      //       file: this.code
      //     });
      //     console.log(this.SaveArray);
      //   }
      //   else {
      //     var flagPath = 0;
      //     this.SaveArray.forEach(element => {
      //       if (element.path == this.prevObj.path) {
      //         if (element.file != this.code) {
      //           var index = this.SaveArray.indexOf(element);
      //           this.SaveArray.splice(index, 1, {
      //             path: this.prevObj.path,
      //             file: this.code
      //           });
      //           console.log(this.SaveArray);
      //         }
      //         flagPath = 1;
      //       } else {
      //       }
      //     });
      //     if (flagPath == 0) {
      //       this.SaveArray.push({
      //         path: this.prevObj.path,
      //         file: this.code
      //       });
      //       console.log(this.SaveArray);
      //     }
      //   }
      //   console.log('changed');
      // }
//////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaa
console.log('changed');
}
console.log(12321);

console.log(this.SaveArray);

      if (this.SaveArrayContainsPath(obj.path).contains) {
        console.log("save array contains");
        console.log(obj, "Sae Array Contains"); //check file extention
        this.checkExtention(obj.name);
        this.code = this.SaveArray[this.SaveArrayContainsPath(obj.path).index].file;
        console.log(this.SaveArray[this.SaveArrayContainsPath(obj.path).index].file.split('\n').length);
        // var nonEditLines = [{ start: 5, end: 10 }, { start: 15, end: 17 }];
        var nonEditLines = this.SaveArray[this.SaveArrayContainsPath(obj.path).index].nonEdit;
        console.log(nonEditLines, "SaveArr");
        

        //////////////////////////////////////////////////
        var fileArr = this.SaveArray[this.SaveArrayContainsPath(obj.path).index].file.split('\n');
        console.log(fileArr);

        this.prevContent = this.content;

        var textline = [];

        nonEditLines.forEach(element => {
          var lineNo = element.startLine;
          while (lineNo <= element.endLine) {
            textline.push(lineNo - 1);
            lineNo += 1;
          }
        });
        console.log(textline);
        this.prevContent = this.content;
        this.content = [];
        //append new ones
        for (let index = 0; index < fileArr.length; index++) {
          console.log(textline.includes(index));
          if (textline.includes(index)) {
            this.content.push({
              text: fileArr[index],
              editable: false,
              id: 'element' + index
            });
          }
          else {
            this.content.push({
              text: fileArr[index],
              editable: true,
              id: 'element' + index
            });
          }
        }
        let modifiedContent = [];
        this.content.map((el, index) => {
          if (index == 0) {
            modifiedContent.push(el);
            return el;
          }

          if (this.content[index - 1].editable == el.editable) {
            modifiedContent[modifiedContent.length - 1].text += '\n' + el.text;
          } else {
            modifiedContent.push(el);
          }
          return el;
        });
        console.log(modifiedContent);
        
        this.content = modifiedContent;

        console.log(this.content);

        //////////////////////////////////////////////////////////////

        this.prevCode = this.code;
      }
      else {
        let url = obj.url;
        console.log(url);
        this.createService.getraw(url).subscribe(
          res => {
            this.code = res;  //displaying in monaco
            console.log(res.split('\n').length);
            var fileArr = res.split('\n');

            // var nonEditLines = [{ start: 5, end: 10 }, { start: 15, end: 17 }];
            var nonEditLines = [];
            //Check in Assigmnent GET about non edit lines
            // this.assignment.nonEdit.forEach(element => {
            //   if (element.path == obj.path) {
            //     nonEditLines = this.assignment.nonEdit;
            //   }
            // });


            ////////////////////////////////////////////////////////////////////////////////////////////
            this.prevContent = this.content
            var textline = [];
            this.content = [];
            nonEditLines.forEach(element => {
              var lineNo = element.startLine;
              while (lineNo <= element.endLine) {
                textline.push(lineNo - 1);
                lineNo += 1;
              }
            });
            console.log("textline");

            //append new ones

            for (let index = 0; index < fileArr.length; index++) {
              // var text = document.createElement('div');
              // const element = array[index];
              console.log(textline.includes(index));

              if (textline.includes(index)) {
                this.content.push({
                  text: fileArr[index],
                  editable: false,
                  id: 'element' + index
                });
              }
              else {
                this.content.push({
                  text: fileArr[index],
                  editable: true,
                  id: 'element' + index
                });
              }
            }
            let modifiedContent = [];
            this.content.map((el, index) => {
              if (index == 0) {
                modifiedContent.push(el);
                return el;
              }

              if (this.content[index - 1].editable == el.editable) {
                modifiedContent[modifiedContent.length - 1].text += '\n' + el.text;
              } else {
                modifiedContent.push(el);
              }
              return el;
            });
            this.content = modifiedContent;
            console.log(modifiedContent);
            ///////////////////////////////////////////////////////////////////////////////////
            console.log(obj); //check file extention
            this.checkExtention(obj.name);
            this.prevCode = res;
          }
        );
      }
      this.prevObj = obj;


    } else {
      console.log('dir clicked      line 150');
      console.log(obj);
      var newArr = [];
      console.log(this.dispTree);
      var newcount = 0;
      this.dispTree.forEach(element => {
        var a = element.path.slice(0, obj.path.length);
        if (a == obj.path) {
          newcount += 1;
        }
      });
      console.log(newcount);
      console.log(this.dispTree);

      console.log(newArr);
      if (newcount > 1) {
        console.log("remove obj");
        var count = 0;
        var tree = [];
        this.dispTree.forEach(element => {
          var p = element.path.slice(0, obj.path.length);
          console.log(obj.path == p);
          if (obj.path == p) {
            count += 1;
          }
          if (count <= 1 || obj.path != p) {
            tree.push(element)
          }
        });
        this.dispTree = tree;
        console.log(tree);

      } else {
        this.showChild(obj);
      }

    }

  }

  //get child elements
  showChild(item) {
    if (item.type == 'dir') {
      console.log(item.path);
      this.createService.getFolder(this.assignment.uname, this.assignment.repo, item.path).subscribe(
        res => {
          // console.log(res);
          res.forEach(element => {
            if (!this.assignment.hidden.includes(element.path)) {
              this.pushTree({
                path: element.path,
                type: element.type,
                name: element.name,
                url: element.download_url
              });
            }
            // console.log(this.dispTree);
          });
        }
      )
    }
  }

  //push into display queue (dispTree[])
  pushTree(obj) {
    var flag = 0;
    this.dispTree.forEach(element => {
      if (element.path == obj.path) {
        flag = 1;
      }
    });
    if (flag == 0) {
      this.dispTree.push(obj);
      // console.log(this.dispTree);
      this.dispTree.sort(function (a, b) {
        if (a.path < b.path) {
          return -1;
        } else {
          return 1;
        }
      });
    }
    // this.toTreenodes(this.dispTree);
  }

  toTreenodes(arr) {
    // var store = [];
    // arr.forEach(element => {
    //   store[arr.indexOf(element)] = element.path.split('/');
    // });
    // // console.log(arr);
    // var savedindex;
    // var prevlen;
    // store.forEach(element => {
    //   console.log(element[element.length-1]);
    // });
    // console.log(store);
  }

  SaveArrayContainsPath(path) {
    var index = -1
    this.SaveArray.forEach(element => {
      if (element.path == path) {
        index = this.SaveArray.indexOf(element)
      }
    });
    if (index != -1) {
      return {
        contains: true,
        index: index
      };
    } else {
      return {
        contains: false,
        index: -1
      };
    }
  }

  saveAssignment() {
    this.currentObj
    if (this.prevContent != this.content) {
      this.saveLocally(this.currentObj);
      //push in SaveArray
      ////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaa
      // if (this.SaveArray.length == 0) {
      //   this.SaveArray.push({
      //     path: this.currentObj.path,
      //     file: this.code
      //   });
      //   console.log(this.SaveArray);
      // }
      // else {
      //   var flagPath = 0;
      //   this.SaveArray.forEach(element => {
      //     if (element.path == this.currentObj.path) {
      //       if (element.file != this.code) {
      //         var index = this.SaveArray.indexOf(element);
      //         this.SaveArray.splice(index, 1, {
      //           path: this.currentObj.path,
      //           file: this.code
      //         });
      //         console.log(this.SaveArray);
      //       }
      //       flagPath = 1;
      //     } else {
      //     }
      //   });
      //   if (flagPath == 0) {
      //     this.SaveArray.push({
      //       path: this.currentObj.path,
      //       file: this.code
      //     });
      //     console.log(this.SaveArray);
      //   }
      // }
      // console.log('changed');
      ////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaa
    }
    var obj = {
      assignmentId: this.route.snapshot.params['id'],
      userId: this.route.snapshot.params['user'],
      content: this.SaveArray
    }
    console.log(obj);
    this.attemptService.PutFromIdUid(obj).subscribe(
      res => console.log('saved in db put')
    )
  }


  openDialog(): void {
    console.log("dialog fun");
    
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
      width: '250px',
      data: { mdpath: this.mdpath }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  checkExtention(str) {
    var arr = str.split('.');
    var ext = arr[arr.length - 1];
    console.log(ext);
    switch (ext) {
      case 'cs':
        this.editorOptions.language = 'csharp'
        break;
      case 'py':
        this.editorOptions.language = 'python'
        break;
      case 'ts':
        this.editorOptions.language = 'typescript'
        break;
      case 'js':
        this.editorOptions.language = 'javascript'
        break;
      case 'html':
        this.editorOptions.language = 'html'
        break;
      case 'css':
        this.editorOptions.language = 'css'
        break;
      default:
        this.editorOptions.language = 'python'
        break;
    }


  }

  // codeMirrorConfig = {
  //   lineNumbers: true,
  //   theme:'twilight',
  //   readOnly: 'nocursor',
  //   lineWrapping : true,
  //   mode: 'xml'
  // }
}

export interface DialogData {
  mdpath: string;
}

@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
})
export class DialogOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log("constructor");
      
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

}