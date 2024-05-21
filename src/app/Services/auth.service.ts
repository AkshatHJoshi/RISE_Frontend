import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7205/api/User/';

  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeTokan(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isloggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //---------------------------------------
  decodeToken() {
    const jwthlper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwthlper.decodeToken(token));
    return jwthlper.decodeToken(token);
  }

  getfullNameFromToken() {
    if (this.userPayload) return this.userPayload.name;
  }
  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }
}
