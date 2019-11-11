import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { QuillConfigService } from 'src/app/services/quillconfig.service';
import { CreateArticleComponent } from './../create-article/create-article.component';
// import * as QuillNamespace from 'quill';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.css']
})
export class ViewArticleComponent implements OnInit {

  Tags;
  Title;
// keyboard=Quill.import('modules/keyboard');
  constructor(private articleService: ArticleService, private quillConfigService: QuillConfigService, private route: ActivatedRoute) { }

  public editor;

  public editorOptions;

  onEditorCreated(quill) {
    this.editor = quill;
// this.editor.keyboard.addBinding({key:this.keyboard.key.Enter,handler:function(range,context){
//   console.log('Enter Key!!');
// }});
    console.log('quill is ready! this is current quill instance object', quill);
  }

  ngOnInit() {
    this.quillConfigService.registerQuillAdditionalOptions();
    this.editorOptions = this.quillConfigService.getGeneralViewConfig();
    this.articleService.getArticleByID(this.route.snapshot.params['id']).subscribe(res => {
      console.log(res);
      console.log(JSON.parse(res.content));
      // this.MYQuillContent=JSON.parse(res.content);
      this.Title = res.title;
      this.Tags = res.tags;
      this.editor.setContents(JSON.parse(res.content));
      this.editor.enable(false);
      });
    setTimeout(() => {
      console.log('you can use the quill instance object to do something', this.editor);
    }, 2800)
  }
}
