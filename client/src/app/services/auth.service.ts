import { Injectable } from '@angular/core';
// import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import Cookies from 'js-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private COOKIENAME = 'jwt';

  helper = new JwtHelperService();

  private isLogged: boolean = false;
  public loggedSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.isLogged);

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

  
  public isLoggedIn():Observable<any> {
    if(this.jwtExists()) {
      this.isLogged = !this.extractJWT().isExpired;
      this.loggedSubject.next(this.isLogged); 
      return this.loggedSubject;
    } else {
      this.isLogged = false;
      this.loggedSubject.next(this.isLogged); 
      return this.loggedSubject;
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
      this.isLogged = true;
      this.loggedSubject.next(this.isLogged);
      return;
    } else {
      document.location.href = `${ environment.accountUrl }/auth/login`;
    }
  }


  public logout() {
    Cookies.remove(this.COOKIENAME);
    this.isLogged = false;
    this.loggedSubject.next(this.isLogged);
    return (Cookies.get(this.COOKIENAME) == null);
  }



}
