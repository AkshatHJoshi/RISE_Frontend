import { Component } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent {

  selectedDate: any;
  bookings: any[] = [];

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
  ) { }

  ngOnInit() {
    this.bookingServioce.getViewBooking().subscribe(
      res => {
        console.log('API Response:', res);
        if (Array.isArray(res)) {
          this.bookings = res;  // Assign only if the response is an array
          this.dateClass();
        } else {
          console.error('Unexpected response format', res);
        }
      },
      error => {
        console.error('Error fetching bookings', error);
      }
    );

  }

  onSelect(event: any) {
    console.log(event);
    this.selectedDate = event;
  }

  closeForm() {
    this.dialogRef.close();
  }
}
