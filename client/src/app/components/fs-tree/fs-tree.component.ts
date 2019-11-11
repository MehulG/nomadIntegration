import { Component, OnInit, OnChanges, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CreateAssignmentService } from 'src/app/services/create-assignment.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { of } from 'rxjs';


/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  type: string;
  path: string;
  children?: FileNode[];
}


/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  path: string;
  level: number;
  expandable: boolean;
}


@Component({
  selector: 'app-fs-tree',
  templateUrl: './fs-tree.component.html',
  styleUrls: ['./fs-tree.component.css']
})
export class FsTreeComponent implements OnInit, OnChanges {
  private loaded = false;

  @Input() username: string = "";
  @Input() repo: string = "";
  @Input() path: string = "";
  @Input() tree: any[] = [];
  // tree: any[] = [];
  @Output() treeChanged: EventEmitter<any[]> = new EventEmitter();


  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(
    private assignmentService: CreateAssignmentService
  ) {}

  // tree = [];
  ngOnChanges(changes: SimpleChanges) {
    // this.gettree();
  }

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    
    if(this.tree.length <= 0) {
      this.gettree();
    } else {
      this.dataSource.data = this.tree
    }
  }

  gettree() {
    this.assignmentService.getFolder(this.username, this.repo, this.path).subscribe(
      res => {
        this.tree = res.map(el => {
          let node = {
            name: el.name,
            type: (el.type == 'file')?'file':'folder',
            // child: (el.type == 'file')?null:el.child,
            path: el.path,
            children: (el.type == 'file')?null: []
          }
          if(el.children) {
            node.children = el.children
          }
          return node;
        })
        this.treeChanged.emit(this.tree);
        this.dataSource.data = this.tree;
      }
    )
  }


  loadMore(){
    if(this.loaded == false) {
      this.loaded = true;
    }
  }

  treeUpdate(tree: any[], node) {
    node.children = tree;
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      level: level,
      path: node.path,
      expandable: (node.type == 'folder')
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.type == 'folder';
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return of(node.children);
  }


}
