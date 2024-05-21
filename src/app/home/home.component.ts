import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { BookingComponent } from '../booking/booking.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selectedDate: any;
  selectedTime: any;
  bookedDates: any[] = [];
  canceledDates: any[] = [];
  date: any;
  public users: any = [];
  dateFilter: any;
  cell!: Date;

  fillDates() {
    this.bookedDates = [
      new Date('2024-05-10'),
      new Date('2024-05-15'),
      new Date('2024-05-20'),
      new Date('2024-05-25'),
      new Date('2024-05-30'),
    ];

    this.canceledDates = [
      new Date('2024-06-02'),
      new Date('2024-06-07'),
      new Date('2024-06-12'),
      new Date('2024-06-17'),
      new Date('2024-06-22'),
    ];
  }

  isWeekend(date: any): boolean {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    const day = date.getDay();
    return day === 6 || day === 0;
  }

  preventSelection = (date: any): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return !this.isWeekend(date) && !this.isCanceled(date) && date >= today;
  };

  isCanceled(date: any): boolean {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    return this.canceledDates.some((cancelDate) =>
      this.isSameDate(date, cancelDate)
    );
  }

  todayDate: Date = new Date();

  isCurrentDate(cellDate: Date): boolean {
    return cellDate.toDateString() === this.todayDate.toDateString();
  }

  isSameDate(date1: any, date2: any): boolean {
    if (
      !date1 ||
      !date2 ||
      !(date1 instanceof Date) ||
      !(date2 instanceof Date)
    ) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public dialog: MatDialog
  ) {
    this.fillDates();
  }

  onDateSelected(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    const currentDate = new Date();

    // Check if the selected date is today
    if (
      selectedDate &&
      selectedDate.toDateString() === currentDate.toDateString()
    ) {
      // this.dialog.open(QrCouponComponent);

      // Update the selected time
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

  ngOnInit() {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  logout() {
    this.auth.signOut();
  }
  signgout() {
    this.auth.signOut();
  }
}
