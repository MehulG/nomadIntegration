import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  searchForm = new FormGroup({
    searchInput: new FormControl('')
  });

  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  fileReader = new FileReader();  

    search(): void {
      let keyword: string = this.searchForm.value.searchInput;
      if (keyword.length) {
        console.log(keyword);
        // this.searchService.searchResult(keyword)
        //    .subscribe(res => console.log(res)
        //    );
        this.router.navigate(['/searchArticle/'+keyword])
      }
    }
  

  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router, 
    private searchService: SearchService,
    private authService: AuthService

) {}
}
