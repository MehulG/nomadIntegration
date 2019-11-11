import { Injectable } from '@angular/core';
// import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import Cookies from 'js-cookie';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private COOKIENAME = 'jwt';

  helper = new JwtHelperService();

  private user: any = {};
  public authSubject: BehaviorSubject<any> = new BehaviorSubject(this.user);

  constructor(
    private http: HttpClient
  ) { }

  public getToken() {
    return Cookies.get(this.COOKIENAME);
  }


  

  // getExpiration() {
  //   let user = this.extractJWT();
  //   return 
  // }

  private jwtExists() {
    if(Cookies.get(this.COOKIENAME) == null) {
      return false;
    } else {
      return true;
    }
  }

  
  public isLoggedIn():boolean {
    if(this.jwtExists()) {
      return !this.extractJWT().isExpired;
    } else {
      return false;
    }
  }

  private extractJWT() {
    let token = this.getToken();
    const decodedToken = this.helper.decodeToken(token);
    const expirationDate = this.helper.getTokenExpirationDate(token);
    const isExpired = this.helper.isTokenExpired(token)
    // const id = decodedToken.id;


    return {
      isExpired,
      expirationDate,
      ...decodedToken
    }
  }


  public login(): void {
    if(this.jwtExists()) {
      this.user = this.extractJWT();
      this.authSubject.next(this.user);
      return;
    } else {
      document.location.href = `${ environment.apiUrl }/account/login`;
    }
  }


  public logout() {
    Cookies.remove(this.COOKIENAME);
    return (Cookies.get(this.COOKIENAME) == null);
  }



}
