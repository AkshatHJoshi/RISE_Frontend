import { Component } from '@angular/core';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quick-booking',
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.css']
})
export class QuickBookingComponent {
  today!: Date;
  tomorrow!: Date;
  tomorrowdate!: string;
  displayDate!: string;
  bookingForm!: FormGroup;

  constructor(
    private bookingservice: BookingService,
    private toast: NgToastService,
    public dialogRef: MatDialogRef<QuickBookingComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      mealType: ['', Validators.required],
    });

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.today.getDate() + 2);
    this.tomorrowdate = this.tomorrow.toISOString().split('T')[0];

    if (this.tomorrow.getDay() === 6) {
      // Saturday
      this.tomorrow.setDate(this.tomorrow.getDate() + 2); // Move to Monday
      this.displayDate = 'Monday';
    } else if (this.tomorrow.getDay() === 0) {
      // Sunday
      this.tomorrow.setDate(this.tomorrow.getDate() + 1); // Move to Monday
      this.displayDate = 'Monday';
    } else {
      this.displayDate = 'tomorrow';
    }

    this.tomorrowdate = this.tomorrow.toISOString().split('T')[0];
  }

  Booking(): void {
    if (this.bookingForm.valid) {
      const mealType = this.bookingForm.value.mealType;
      console.log('Form Data:', { mealType });
      this.bookingservice.tommarowBooking(mealType).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Meal Booked for tomorrow',
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
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}
