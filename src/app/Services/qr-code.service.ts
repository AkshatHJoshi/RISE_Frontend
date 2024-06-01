import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private baseUrl: string = 'https://localhost:7205/api/Coupon/';
  constructor(private http: HttpClient, private router: Router) {}

  generateQrCode() {
    const email = localStorage.getItem('email');
    console.log(email);
    const qrEmailObj = {
     
      email: email
    } 
   
    return this.http.post<any>(`${this.baseUrl}GenerateCouponCode`, qrEmailObj);
  }

  checkQrCode(qrdata: any)
  {
    const email = localStorage.getItem('email');
    console.log(email);
    const qrvalidateObj = {
     
      email: email,
      couponCode : qrdata
    } 
   
    return this.http.post<any>(`${this.baseUrl}ValidateCouponCode`, qrvalidateObj);

  }
}
