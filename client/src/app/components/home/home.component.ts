import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private accountService: AccountService) { }
  cards = [{
    name: "C Sharp",
    image: `https://cdn.worldvectorlogo.com/logos/c--4.svg`
}, {
    name: "Angular",
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/512px-Angular_full_color_logo.svg.png`
    }, {
    name: "Javascript",
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png`
  }]
  ngOnInit() {
    
  }
}