import { Component } from '@angular/core';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quick-booking',
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.css']
})
export class QuickBookingComponent {
  today!: Date;
  tomorrow!: Date;
  tomorrowdate!: string;
  displayDay!: string;

  constructor(
    private bookingservice: BookingService,
    private toast: NgToastService,
    public dialogRef: MatDialogRef<QuickBookingComponent>
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrowdate = this.tomorrow.toISOString().split('T')[0];

    if (this.tomorrow.getDay() === 6) {
      // Saturday
      this.tomorrow.setDate(this.tomorrow.getDate() + 2); // Move to Monday
      this.displayDay = 'Monday';
    } else if (this.tomorrow.getDay() === 0) {
      // Sunday
      this.tomorrow.setDate(this.tomorrow.getDate() + 1); // Move to Monday
      this.displayDay = 'Monday';
    } else {
      this.displayDay = 'tomorrow';
    }

    this.tomorrowdate = this.tomorrow.toISOString().split('T')[0];
  }

  Booking(): void {
    this.bookingservice.tommarowBooking().subscribe({
      next: (res) => {
        this.toast.success({
          detail: `Meal Booked for ${this.displayDay}`,
          summary: res.message,
          duration: 3000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'Meal Not Booked',
          summary: err.message,
          duration: 3000,
        });
      },
    });
    this.closeForm();
  }
  closeForm() {
    this.dialogRef.close();
  }
}
