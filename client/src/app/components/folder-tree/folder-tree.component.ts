import { Component, OnInit, Inject, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateAssignmentService } from './../../services/create-assignment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.css']
})
export class FolderTreeComponent implements OnInit, OnChanges {


  @Input() username: string;
  @Input() repo: string;
  @Input() path: string;
  @Input() tree: any[] = [];
  @Output() treeChanged: EventEmitter<any[]> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private createService: CreateAssignmentService,
    private assignmentService: CreateAssignmentService,
    public dialog: MatDialog
  ) { }
    
  ngOnChanges() {
    // this.gettree();
  }

  ngOnInit() {
    this.gettree();
  }

  gettree(path: string = null) {
    path =(path)?path:this.path;
    this.assignmentService.getFolder(this.username, this.repo, path).subscribe(
      res => {
        let tree = res.map(el => {
          let node = {
            name: el.name,
            type: el.type,
            path: el.path.split('/'),
            url: el.download_url
          }
          return node;
        })
        if(path == this.path) {
          this.tree = tree;
        } else {
          let index: number = 0;
          this.tree.map((el, i) => {
            if(el.path.join('/') == path) {
              index = i;
            }
            return el;
          })
          this.tree[index].children_count = tree.length;
          this.tree.splice(index+1,0, ...tree);
        }
        this.treeChanged.emit(this.tree);
      }
    )
  }

  display(obj:any) {
    if(obj.type == 'dir') {
      if(obj.children_count) {
        console.log(obj.children_count);
        if(!obj.children || obj.children.length == 0) {// means that content in the folder is visible
          obj.children = [];
          obj.children_count
          let index = 0;
          this.tree = this.tree.filter((el, i) => {
            if(el.path.join('/') == obj.path.join('/')) {
              index = i;
            }
            let sliced = el.path.slice(0,obj.path.length);
            if((sliced.join('/') == obj.path.join('/')) && index != i) {
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
            if(el.path.join('/') == obj.path.join('/')) {
              index = i;
            }
            return el;
          })
          this.tree.splice(index+1, 0, ...obj.children);
          this.tree[index].children = [];
        }
      } else {
        this.gettree(obj.path.join('/'));
      }
      this.treeChanged.emit(this.tree);
    }
  }

  getClass(path: string[], type: string) {
    let _class= (type == 'file')?path.slice(0,path.length - 1).join('_'): path.join('_');
    _class.replace(/\s+/g, '');
    return _class;
  }
}