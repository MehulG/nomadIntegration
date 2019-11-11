import { Component, OnInit } from '@angular/core';
import { SearchService } from './../../services/search.service';
import { ActivatedRoute,Router,Navigation, NavigationEnd } from '@angular/router'


@Component({
  selector: 'app-display-results',
  templateUrl: './display-results.component.html',
  styleUrls: ['./display-results.component.css']
})
export class DisplayResultsComponent implements OnInit {

  constructor(private searchService: SearchService, private activatedRoute: ActivatedRoute, private route:Router) { }
  results = [];
  ngOnInit() {
    this.searchService.searchResult(this.activatedRoute.snapshot.params['query'])
      .subscribe(res => {
        console.log(res);
        this.results = res;
      }
      );
      // this.searchService.filterByTags(this.activatedRoute.snapshot.params['tag'])
      // .subscribe(res => {
      //   console.log(res);
      //   this.results = res;
      // }
      // );
      this.route.events.subscribe((event) => {
        if(event instanceof NavigationEnd) {
            // console.log(event.url.split('/')[event.url.split('/').length-1]);
            this.searchService.searchResult(this.activatedRoute.snapshot.params['query'])
            .subscribe(res => {
              console.log(res);
              this.results = res;
            }
            );
        }
    });    
  }
}
