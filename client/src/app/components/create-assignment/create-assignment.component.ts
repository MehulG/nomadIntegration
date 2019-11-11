import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, Inject, ViewChildren } from '@angular/core';
import { CreateAssignmentService } from 'src/app/services/create-assignment.service';
import { map } from "lodash";
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { range } from 'rxjs';



@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']

})
export class CreateAssignmentComponent implements OnInit {


  // accessToken;
  children;
  options = {};
  path: string = '';
  fileName;
  nonEdit: any = [];
  ChangedArray = [];
  SavedArray = [];
  selectionRangeCollection = {}; // filename and corresponding selectionrangearray

  selectionArray = [];
  assignment: any;

  static modal_flag: boolean = false;
  constructor(
    private assignmentService: CreateAssignmentService,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.assignmentService.getAssignment(this.route.snapshot.params["id"])
      .subscribe({
        next: data => {
          this.assignment = data
          this.hiddenfiles = (data.hidden)?data.hidden:[];
          this.getRangeMap(data.readOnly);
          this.gettree();
          // console.log(this.hiddenfiles)
        },
        complete: () => {
          // this.modify();
          // this.decorate();
        }
      });

  }

  decorationsMap: any = {};

  // decorations = [];

  editorOptions = { theme: 'vs-dark', language: 'python' };
  code: string;
  editor;


  onInit(editor) {
    this.editor = editor;
    // var model = editor.getModel();
    // console.log(model);
  }



  // selectionRangeArray: monaco.Range[] = [];
  rangemap: any = {};
  viewOnly() {
    console.log(this.path);
    if (this.selectionRangeCollection[this.path] == null) {
      this.selectionRangeCollection[this.path] = [];
    }
    let selectionRangeArray = this.selectionRangeCollection[this.path];
    console.log(selectionRangeArray);

    let selection = this.editor.getSelection()
    let endColumn: number = selection.endColumn;
    let endLineNumber: number = selection.endLineNumber;
    let startColumn: number = selection.startColumn;
    let startLineNumber: number = selection.startLineNumber;

    let ranges = [];
    let flag = false;
    let selectionrange = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);
    let rangearray = selectionRangeArray.filter(el => {
      if (monaco.Range.areIntersectingOrTouching(el, selectionrange)) {
        ranges.push(el);
        flag = true;
        return false;
      }
      return true;
    })

    if (flag) { // the range is intersecting
      ranges.forEach(el => {
        selectionrange = monaco.Range.plusRange(el, selectionrange);
      })
    }

    this.editor.deltaDecorations([], [
      { range: selectionrange, options: { className: 'INSERT' } },
    ]);
    // this.decorate([{ range: selectionrange, options: { className: 'INSERT' }}])

    rangearray.push(selectionrange);

    this.selectionRangeCollection[this.path] = rangearray;

    // this.nonEdit = selectionRangeArray.map(el => {
    //   return {
    //     startLineNumber: el.startLineNumber,
    //     endLineNumber: el.endLineNumber
    //   };
    // })
    // console.log(this.nonEdit);


    // this.rangemap[this.path] = this.nonEdit
    this.rangemap[this.path] = this.selectionRangeCollection[this.path].map(el => {
      return {
        startLineNumber: el.startLineNumber,
        endLineNumber: el.endLineNumber
      };
    })
    console.log(this.rangemap);
  }


  Editable() {
    if (this.selectionRangeCollection[this.path] == null) {
      this.selectionRangeCollection[this.path] = [];
    }
    let selectionRangeArray: any[] = this.selectionRangeCollection[this.path];

    const selection = this.editor.getSelection();

    let ranges = [];
    let intersetions = [];
    let flag = false;
    const selectionrange = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
    let rangearray = selectionRangeArray.filter(el => {
      if(monaco.Range.containsRange(selectionrange, el)) {
        // ranges.push(el);
        intersetions.push(monaco.Range.intersectRanges(el, selectionrange));
        flag = true;
        return false;
      } else if(monaco.Range.areIntersecting(el, selectionrange)) {
        if(el.startLineNumber < selectionrange.startLineNumber) {
          ranges.push({
            startLineNumber: el.startLineNumber,
            startColumn: el.startColumn,
            endLineNumber: selectionrange.startLineNumber,
            endColumn: selectionrange.startColumn
          })
        }
        intersetions.push(monaco.Range.intersectRanges(el, selectionrange));
        if(el.endLineNumber > selectionrange.endLineNumber) {
          ranges.push({
            startLineNumber: selectionrange.endLineNumber,
            startColumn: selectionrange.endColumn,
            endLineNumber: el.endLineNumber,
            endColumn: el.endColumn
          })
        }
        flag = true;
        return false;
      } else {
        return true;
      }
    })
    
    if(flag) {
      intersetions.map(el => {
        this.editor.deltaDecorations([], [
          { range: new monaco.Range(el.startLineNumber, el.startColumn, el.endLineNumber, el.endColumn), options: { className: 'NEWINSERT' } },
        ]);
      })
      rangearray = rangearray.concat(ranges);
    }

    this.selectionRangeCollection[this.path] = rangearray;
    this.rangemap[this.path] = this.selectionRangeCollection[this.path].map(el => {
      return {
        startLineNumber: el.startLineNumber,
        endLineNumber: el.endLineNumber
      };
    })
    console.log(this.rangemap);
  }

  hiddenfiles: string[] = [];
  toggle(obj) {
    if(obj.type == 'file') {

      let index = this.hiddenfiles.indexOf(obj.path);
      if(index == -1) {
        this.hiddenfiles.push(obj.path);
      } else {
        this.hiddenfiles.splice(index,1);
      }
    } else {

      let flag = (this.hiddenfiles.indexOf(obj.path) == -1);

      if (obj.children_count) {
        console.log(obj.children_count);
        if (!obj.children || obj.children.length == 0) {// means that content in the folder is visible
          this.tree.map((el, i) => {
            let sliced = el.path.split('/').slice(0, obj.path.split('/').length);
            if (sliced.join('/') == obj.path) {
              let index = this.hiddenfiles.indexOf(el.path);
              if(index == -1 && flag == true) {
                this.hiddenfiles.push(el.path);
              } else if(flag == false) {
                this.hiddenfiles.splice(index, 1);
              }
            } 
            return el;
          });
        } else { // means that content in the folder is not visible
          let index: number = 0;
          this.tree.map((el, i) => {
            if (el.path == obj.path) {
              index = i;
            }
            return el;
          })
          // this.tree.splice(index + 1, 0, ...obj.children);
          // this.tree[index].children = [];
          let a = Object.assign({}, this.tree[index]);
          let b = a.children;
          a.children = [];
          if(flag) {
            this.hiddenfiles.push(a);
            b.map(el => {
              if (this.hiddenfiles.indexOf(el.path) == -1) {
                this.hiddenfiles.push(el);
              }
            });
          } else {
            b.push(a);
            b.map(el => {
              let i = this.hiddenfiles.indexOf(el.path);
              if(i > -1) {
                this.hiddenfiles.splice(i, 1);
              }
            })
          }
        }
      } else {
        if(flag) {
          this.hiddenfiles.push(obj.path);
        } else {
          let index = this.hiddenfiles.indexOf(obj.path);
          this.hiddenfiles.splice(index,1);
        }
      }
    }
    console.log(this.hiddenfiles);
    // this.modify();
  }


  modify() {
    console.log(this.hiddenfiles);
    console.log(this.tree);
    this.tree.map(el => {
      if(this.hiddenfiles.indexOf(el.path) == -1) {
        document.getElementById(this.getPathId(el.path, el.type)).classList.remove('hide');
        // document.getElementById(el.path).classList.remove('hide');
      } else {
        document.getElementById(this.getPathId(el.path, el.type)).classList.add('hide');
        // document.getElementById(el.path).classList.add('hide');
      }
    })
  }

  tree: any[] = [];
  gettree(path: string = null) {
    path = (path) ? path : '';
    this.assignmentService.getFolder(this.assignment.userName, this.assignment.repo, path).subscribe(
      res => {
        let tree = res.map(el => {
          let node = {
            name: el.name,
            type: el.type,
            // path: el.path.split('/'),
            path: el.path,
            url: el.download_url
          }
          return node;
        })
        if (path == this.path) {
          this.tree = tree;
        } else {
          let index: number = 0;
          this.tree.map((el, i) => {
            // if(el.path.join('/') == path) {
            if (el.path == path) {
              index = i;
            }
            return el;
          })
          this.tree[index].children_count = tree.length;
          this.tree.splice(index + 1, 0, ...tree);
        }
      },
      // err => {},
      // () => {this.modify()}
    )
  }

  display(obj: any) {
    if (obj.type == 'dir') {
      if (obj.children_count) {
        console.log(obj.children_count);
        if (!obj.children || obj.children.length == 0) {// means that content in the folder is visible
          obj.children = [];
          let index = 0;
          this.tree = this.tree.filter((el, i) => {
            if (el.path == obj.path) {
              index = i;
            }
            let sliced = el.path.split('/').slice(0, obj.path.split('/').length);
            if ((sliced.join('/') == obj.path) && index != i) {
              obj.children.push(el);
              return false;
            } else {
              return true;
            }
          });
          this.tree.splice(index, 1, obj);
        } else { // means that content in the folder is not visible
          let index: number = 0;
          this.tree.map((el, i) => {
            if (el.path == obj.path) {
              index = i;
            }
            return el;
          })
          this.tree.splice(index + 1, 0, ...obj.children);
          this.tree[index].children = [];
        }
      } else {
        this.gettree(obj.path);
      }
    } else {
      console.log(obj.name);

      this.path = obj.path;
      this.fileName = obj.name;
      let url = obj.url;
      console.log(url);
      this.assignmentService.getraw(url).subscribe({
        next: res => {
            // console.log(res);
            this.code = res;
            // this.decorate();
          },
        complete: () => {
          if (this.selectionRangeCollection[this.path]) {
            this.selectionRangeCollection[this.path].map(el => {
              this.editor.deltaDecorations([], [
                { range: new monaco.Range(el.startLineNumber, el.startColumn, el.endLineNumber, el.endColumn), options: { className: 'INSERT' } }
              ]);
              return el;
            })
          }
        }

      });
    }
  }

  getRangeMap(data) {
    // let result = {};
    // console.log('data',data);
    if(data) {
      // console.log(data);
      data.map(el => {
        // console.log('el', el)
        let range = [];
        el.readOnlyRanges.map(a => {
          range.push({
            startLineNumber: a.startLine,
            startColumn: a.startColumn,
            endLineNumber: a.endLine,
            endColumn: a.endColumn
          });
          return a;
        })
        this.selectionRangeCollection[el.path] = range;
        return el;
      })
    }
    console.log('modified',this.selectionRangeCollection);
  }

  save() {

    let patharr = Object.keys(this.selectionRangeCollection);
    // let rangearr = Object.values(this.rangemap);
    let rangemap = Object.assign(this.selectionRangeCollection);
    console.log(rangemap);
    let restructured = patharr.map((el,i) => {
      let range = [];
      rangemap[el].map(a => {
        range.push({
          startLine: a.startLineNumber,
          startColumn: a.startColumn,
          endLine: a.endLineNumber,
          endColumn: a.endColumn
        });
        return el;
      })
      return {
        path: el,
        readOnlyRanges: range
      }
    })
    var content = {
      hidden: this.hiddenfiles,
      readOnly: restructured,
      publish: false
    };
    console.log(content);
    this.assignmentService.edit(this.assignment.id, content)
      .subscribe(res => console.log(res));

  }

  getPathId(path: string, type: string) {
    let _id= (type == 'file')?path.split('/').slice(0,path.length - 1).join('_'): path.split('/').join('_');
    _id.replace(/\s+/g, '');
    _id.replace(/[.]/g, '_');
    return _id;

  }

  decorate(rangearr, flag) {
    let decorations = [];
    let options = {};
    if(flag) {
      options = { className: 'INSERT' }
    } else {
      options = { className: 'NEWINSERT' }
    }
    rangearr.map(el => {
      decorations.push({range: new monaco.Range(el.startLineNumber, el.startColumn, el.endLineNumber, el.endColumn), options: options })
    })
    this.editor.deltaDecorations([], decorations);
  }

}