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
    let stratdate = new Date(bookingObj.admDateRange.startDate);
    stratdate.setDate(bookingObj.admDateRange.startDate.getDate() + 1);

    let enddate = new Date(bookingObj.admDateRange.endDate);
    enddate.setDate(bookingObj.admDateRange.endDate.getDate() + 1);

    const bookingEmailObj = {
      startDate: stratdate.toISOString().split("T")[0],
      endDate:enddate.toISOString().split("T")[0],
      type : bookingObj.BookingType,
      email: email
    } 

    console.log('bookingemailobj:',bookingEmailObj);
    return this.http.post<any>(`${this.baseUrl}CreateBooking`, bookingEmailObj);
  }

  getAllowaccess() {
    const email = localStorage.getItem('email');
    const allowbookingObj = {
      email: email
    } 
    
    return this.http.post<any>(`${this.baseUrl}Allowedaccess`,allowbookingObj);
  }

  getCredits(selectedDate :any){
    const email = localStorage.getItem('email');
    let nextDay = new Date(selectedDate);
   nextDay.setDate(selectedDate.getDate() + 1); 
    const CreditsObj = {
      email: email,
      selecteddate: nextDay.toISOString().split("T")[0]
    } 
    
    return this.http.post<any>(`${this.baseUrl}Credits_and_bookingstatus`,CreditsObj);

  }

  doCancelBooking(selectedDate :any)
  {
    const email = localStorage.getItem('email');
   // console.log(selectedDate)              // till here comes selected day 
   let nextDay = new Date(selectedDate);
   nextDay.setDate(selectedDate.getDate() + 1);  // adding one day because it was canceling previous day then selected day
    const cancelBookingObj = {
     
      email: email,
      selecteddate: nextDay.toISOString().split("T")[0]
      

    } 
    
    console.log(cancelBookingObj)
    return this.http.put<any>(`${this.baseUrl}CancelBooking`,cancelBookingObj);

  }


}
