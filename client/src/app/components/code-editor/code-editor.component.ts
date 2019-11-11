import { Component, OnInit } from '@angular/core';
import { GithubRepoService } from 'src/app/services/github-repo.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  constructor(private githubRepoService:GithubRepoService) { }

  ngOnInit() {
  }

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string = 'function x() {\nconsole.log("Hello World");\n}';
}
