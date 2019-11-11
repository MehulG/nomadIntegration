import { Component, OnInit } from '@angular/core';
import { SearchService } from './../../services/search.service';
import { ActivatedRoute,Router,Navigation, NavigationEnd } from '@angular/router'


@Component({
  selector: 'app-filter-by-tags',
  templateUrl: './filter-by-tags.component.html',
  styleUrls: ['./filter-by-tags.component.css']
})
export class FilterByTagsComponent implements OnInit {
results=[];
  constructor(private searchService: SearchService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.searchService.filterByTags(this.route.snapshot.params['tag'])
    .subscribe(res => {
      console.log(res);
      this.results = res;
    }
    );
  }

}
