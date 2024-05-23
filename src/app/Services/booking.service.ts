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

  getAllowbooking() {
    const email = localStorage.getItem('email');
    const allowbookingObj = {
      Email: email
    } 
    
    return this.http.post<any>(`${this.baseUrl}Allowedbookings`,allowbookingObj);
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
