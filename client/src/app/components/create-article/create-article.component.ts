import { Component, OnInit } from '@angular/core';
import { ArticleService } from './../../services/article.service'
import { from } from 'rxjs';
import { QuillConfigService } from 'src/app/services/quillconfig.service';
import { deltaToMarkdown } from 'quill-delta-to-markdown';
import { HttpClient } from '@angular/common/http'
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { element } from 'protractor';
export interface Tag {
  name: string;
}
@Component({
  selector: 'app-view-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  title = 'chip';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [
  ];
  tagArr = [];
  TitleValue(inputValue) {
    this.ArticleTitleName = inputValue;

  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
      console.log(this.tags);

    }
    if (event.value.trim() != "") {
      this.tagArr.push(event.value.trim());

      console.log(this.tagArr);
      var stringdata = JSON.stringify(this.data);
      if(this.flag=false){
        this.articleService.addArticle({
          "title": this.ArticleTitleName,
      "userId": "string",
      "tags": this.tagArr,
      "content": stringdata
        }).subscribe(res => {
          this.NewArticle = res.id;
          console.log('sdajkd');
          
          console.log(this.NewArticle)
         }
         );
        this.flag = !this.flag;
        console.log(this.flag)
        
      }
      else{
      this.articleService.updateArticle(this.NewArticle, {
        "title": this.ArticleTitleName,
        "userId": "string",
        "tags": this.tagArr,
        "content": stringdata
      }).subscribe(res => console.log(res)
      );}
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);
    const index1 = this.tagArr.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagArr.splice(index1, 1);
    }
    var stringdata = JSON.stringify(this.data);
    this.articleService.updateArticle(this.NewArticle, {
      "title": this.ArticleTitleName,
      "userId": "string",
      "tags": this.tagArr,
      "content": stringdata
    }).subscribe(res => console.log(res)
    );

  }
flag=false;
  articleByTitle;
  data = {};
  markdown = '';
  NewArticle;
  ArticleTitleName = "";
  public editor;
  public editorContent = `<h3>I am Example content</h3>`;
  public editorOptions;
  constructor(
    private articleService: ArticleService,
    private quillConfigService: QuillConfigService,
    private router: Router
  ) { }


  onEditorBlured(quill) {
    console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
    this.data = this.editor.getContents();
    console.log(JSON.stringify(this.data));
    var stringdata = JSON.stringify(this.data);
    //  console.log(JSON.stringify(this.data));
    if (JSON.stringify(this.data) != "{\"ops\":[{\"insert\":\"I am Example content\"},{\"attributes\":{\"header\":3},\"insert\":\"\\n\"}]}" || this.ArticleTitleName != "") {
      if(this.flag==false){
        this.articleService.addArticle({
          "title": this.ArticleTitleName,
        "userId": "string",
        "tags": this.tagArr,
        "content": stringdata
        }).subscribe(res => {
          this.NewArticle = res.id;
          console.log('sdajkd');
          console.log(this.NewArticle)
         }
         );
      
        this.flag = !this.flag;
      }
      else{
      this.articleService.updateArticle(this.NewArticle, {
        "title": this.ArticleTitleName,
        "userId": "string",
        "tags": this.tagArr,
        "content": stringdata
      }).subscribe(res => console.log(res)
      );}      
    }
    console.log(this.NewArticle);

  }

  showdata() {
    // this.markdown = deltaToMarkdown(this.data);
    // console.log(typeof deltaToMarkdown(this.data));
    // console.log(this.markdown, "markdown");
    console.log(this.NewArticle);
    //console.log(JSON.stringify(this.data));
    this.router.navigate(['/article/' + this.NewArticle]);
  }
  ngOnInit() {
    this.quillConfigService.registerQuillAdditionalOptions();
    this.editorOptions = this.quillConfigService.getGeneralWysiwygConfig();
    setTimeout(() => {
      // this.editorContent = '<h1>content changed!</h1>';
      // console.log(this.editorContent);
      // console.log('you can use the quill instance object to do something', this.editor);
      // this.articleService.addArticle({
      //   "title": "DefaultTitle",
      //   "userId": "string",
      //   "tags": [],
      //   "content": ""
      // }).subscribe(res => {
      // this.NewArticle = res.id;
      //   console.log(this.NewArticle)
      // }
      // );
      // this.editor.disable();
    }, 2800)
  }
 // public editorContent1;


}
