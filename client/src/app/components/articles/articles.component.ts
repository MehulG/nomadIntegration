import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  Articles = [];
  Art;
  constructor(private articleService: ArticleService,
    private searchService: SearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }
image;
  ngOnInit() {
this.getArticles();
    this.searchService.filterByTags(this.activatedRoute.snapshot.params['tag'])
      .subscribe(res => {
        console.log(res);
        this.Articles = res;
      }
      );
    this.articleService.qwerty('string').subscribe(
      res => {
        console.log(res)
        res.forEach(element => {
        //  console.log(element);
          JSON.parse(element.content).ops.forEach(element1 => {
            //console.log(element1.insert.image);
            if (element1.insert.image != undefined) {
              this.image = element1.insert.image
            }
            // if (element1.insert.substring(0, 5) == 'image') {
            //   console.log(element1.insert.substring(0, 5));
            // }
          });
        });
      }
    )
    this.searchService.searchResult(this.activatedRoute.snapshot.params['query'])
    .subscribe(res => {
      console.log(res);
      this.Articles = res;
    }
    );
}

  getArticles() {
    this.articleService.get().subscribe(res => {
      res.forEach(element => {
        this.Articles.push(element.title);
       // console.log(element.title)
      });
      this.Art = res;
      console.log(this.Art);
    });
  }
}
