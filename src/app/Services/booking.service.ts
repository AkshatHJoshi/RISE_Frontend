import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl: string = 'https://localhost:7205/api/Booking/';
  constructor(private http: HttpClient, private router: Router) {}

  addBooking(bookingObj: any) {
    const email = localStorage.getItem('email');
    console.log(email);
    console.log(bookingObj);


    const bookingEmailObj = {
      StartDate: bookingObj.admDateRange.startDate,
      EndDate: bookingObj.admDateRange.endDate,
      Type : bookingObj.BookingType,
      Email: email
    } 

    console.log(bookingEmailObj);
    return this.http.post<any>(`${this.baseUrl}CreateBooking`, bookingEmailObj);
  }
}
