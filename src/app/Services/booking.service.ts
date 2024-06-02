import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl: string = 'https://localhost:7205/api/Booking/';
  private baseUrl1:string = 'https://localhost:7205/api/User/';
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


  sendcontectdata(contectobj: any)
  {
   // const email = localStorage.getItem('email');
   //email also comes from frontend form

    const contectobj1 = {
      fullName:contectobj.Fullname ,
      email:contectobj.Email,
      subject : contectobj.Subject,
      body: contectobj.Comment
    } 
    console.log("ooooooooooo" ,contectobj1);

    return this.http.post<any>(`${this.baseUrl1}contectus`, contectobj1);
  
  }


  tommarowBooking(mealType: string): Observable<any> {
    const email = localStorage.getItem('email');
    const TmwObj = {
      email: email,
      type: mealType, // Include the meal type in the request payload
    };

    return this.http.post<any>(
      `${this.baseUrl}CreateBookingForTomorrow`,
      TmwObj
    );
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

  doCancelBooking(selectedDate: any, mealOption: string) {
    const email = localStorage.getItem('email');
    let nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const cancelBookingObj = {
      email: email,
      selecteddate: nextDay.toISOString().split('T')[0] ,
      type: mealOption, // Add meal option to the cancelBookingObj
    };

    console.log(cancelBookingObj);
    return this.http.put<any>(`${this.baseUrl}CancelBooking`, cancelBookingObj);
  }

  getViewBooking() {
    const email = localStorage.getItem('email');
    console.log(email);
    const viewEmailObj = {
      email: email
    } 
   
    return this.http.post<any>(`${this.baseUrl}ViewBookings`, viewEmailObj);
  }


}
