import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  isLoggedIn: boolean = false;
  user: any = {};


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
      this.router.navigate(['/searchArticle/' + keyword])
    }
  }


  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private searchService: SearchService,
    private http: HttpClient, 
    private authService: AuthService, 
    private route: Router,
  ) { }

  ngOnInit() {
    // this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.isLoggedIn()
      .subscribe(res => {
        this.isLoggedIn = res;
      })
    this.authService.loggedSubject.subscribe(res => this.isLoggedIn = res);
    this.authService.authSubject
      .subscribe(user => this.user = user);
  }

  getValues() {
    
    this.http.get(`${environment.apiUrl}/values`)
      .subscribe(res => console.log(res));
  }
  getValues1() {
    this.http.get(`${environment.apiUrl}/values/3434`)
      .subscribe(res => console.log(res));
  }


  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/']);
  }



}
