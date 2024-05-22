import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingComponent } from '../booking/booking.component';
import { BookingService } from '../Services/booking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  bookedDates: Date[] = [];
  canceledDates: Date[] = [];
  dateFilter!: (date: Date | null) => boolean;
  allowbooking!: number;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public dialog: MatDialog,
    private bookingservice: BookingService
  ) {
    this.fillDates();
  }

  ngOnInit() {
    this.bookingservice.getAllowbooking().subscribe((res) => {
      this.allowbooking = res;
      console.log(this.allowbooking); // gives all users data
    });

    this.fetchAllowBookingAndSetDateFilter();
  }

  fetchAllowBookingAndSetDateFilter() {
    this.bookingservice.getAllowbooking().subscribe({
      next: (res) => {
        this.allowbooking = res.allowedBookings;
        console.log(this.allowbooking); // Output the allowed days
        this.setDateFilter();
      },
      error: (error) => {
        console.error('Error fetching allowed booking:', error);
      }
    });
  }

  setDateFilter() {
    this.dateFilter = (date: Date | null): boolean => {
      if (!date) {
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      

      if (this.allowbooking === undefined) {
        console.error("allowbooking is undefined");
        return false;
      }

      const maxDate = this.calculateMaxDate(today, this.allowbooking);//////////
      maxDate.setHours(0, 0, 0, 0); // Reset time to compare only dates

      return date > today && date <= maxDate && !this.isWeekend(date) && !this.isCanceled(date);
    };
  }

  fillDates() {

    this.canceledDates = [

      //  Holiday of 2024
      
      new Date('2024-01-16'),    //Vassi Uttarayan (Next day to Makar Sankranti) -Monday
      new Date('2024-01-26'),     //Republic Day -Friday
      new Date('2024-03-08'),     //Maha Shivratri -Friday
      new Date('2024-03-25'),     //Holi 2nd Day - Dhuleti -Monday
      new Date('2024-08-15'),      //Independence Day -Thursday
      new Date('2024-08-19'),      //Raksha Bandan -Monday
      new Date('2024-10-31'),       //Diwali (Dipawali) -Thursday

    ];
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 6 || day === 0;
  }

  isCanceled(date: Date): boolean {
    return this.canceledDates.some((cancelDate) => this.isSameDate(date, cancelDate));
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  calculateMaxDate(startDate: Date, workingDays: number): Date {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < workingDays) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0 && !this.isCanceled(currentDate))
         {
        addedDays++;
         }
    }

    return currentDate;
  }

  onDateSelected(event: Date | null) {
    if (event === null) return;

    const selectedDate = event;
    const currentDate = new Date();

    if (selectedDate.toDateString() === currentDate.toDateString()) {
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:${seconds}`;
    }
  }

  openAddBookingDialog() {
    this.dialog.open(BookingComponent);
  }

  openViewBookingDialog() {
    this.dialog.open(BookingComponent);
  }

  logout() {
    this.auth.signOut();
  }

  signgout() {
    this.auth.signOut();
  }
}
