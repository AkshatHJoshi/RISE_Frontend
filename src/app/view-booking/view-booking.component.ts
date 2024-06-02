import { Component, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent {
@ViewChild('calendar') calendar!: MatCalendar<Date>;
selectedDate: any;
bookings: any[] = [];
bookingCount!: number;
totalBookingCount!: number;

dateClass() {
  return (date: Date): MatCalendarCellCssClasses => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return '';
    }

    const highlightDate = this.bookings
      .map((strDate) => new Date(strDate))
      .some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );

    return highlightDate ? 'special-date' : '';
  };
}
constructor(
  private toast: NgToastService,
  private bookingServioce: BookingService,
  public dialogRef: MatDialogRef<ViewBookingComponent>
) {}

ngOnInit() {
  this.bookingServioce.getViewBooking().subscribe(
    (res) => {
      console.log('API Response:', res);
      if (Array.isArray(res)) {
        this.bookings = res.map((booking) => new Date(booking));
        this.updateMonthlyBookingCount(
          new Date().getMonth(),
          new Date().getFullYear()
        ); // Initial count for the current month
        this.updateTotalBookingCount(); // Update total count
        this.dateClass(); // Update date class after fetching
      } else {
        console.error('Unexpected response format', res);
      }
    },
    (error) => {
      console.error('Error fetching bookings', error);
    }
  );
  this.calendar.stateChanges.subscribe(() => {
    const activeDate = this.calendar.activeDate;
    this.updateMonthlyBookingCount(
      activeDate.getMonth(),
      activeDate.getFullYear()
    );
    this.updateTotalBookingCount(); // Update total count on month change
  });
}

private filterBookingsByMonth(month: number, year: number) {
  return this.bookings.filter(
    (booking) =>
      booking.getMonth() === month && booking.getFullYear() === year
  );
}

updateMonthlyBookingCount(month: number, year: number) {
  const filteredBookings = this.filterBookingsByMonth(month, year);
  this.bookingCount = filteredBookings.length;
  console.log(
    `Total Booked Dates for ${month + 1}/${year}:`,
    this.bookingCount
  );
}

updateTotalBookingCount() {
  this.totalBookingCount = this.bookings.length;
  console.log('Total Booked Dates:', this.totalBookingCount);
}

onActiveDateChange(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  this.updateMonthlyBookingCount(month, year);
  this.updateTotalBookingCount(); // Update total count on month change
}

onSelect(event: any) {
  console.log(event);
  this.selectedDate = event;
}

closeForm() {
  this.dialogRef.close();
}
}
