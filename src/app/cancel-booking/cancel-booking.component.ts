import { Component, Inject, Input } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent {
  cancelBookingForm: FormGroup;
  selectedDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date },
    private bookingService: BookingService,
    private toast: NgToastService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<CancelBookingComponent>
  ) {
    this.selectedDate = data.selectedDate;
    this.cancelBookingForm = this.formBuilder.group({
      mealType: ['', Validators.required],
    });
  }

  cancelBooking(): void {
    if (this.cancelBookingForm.valid) {
      const mealType = this.cancelBookingForm.value.mealType;
      // Pass selected date, meal type to the cancel booking service
      this.bookingService
        .doCancelBooking(this.selectedDate, mealType)
        .subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'Meal Canceled',
              summary: res.message,
              duration: 3000,
            });
            this.closeForm();
          },
          error: (err) => {
            this.toast.error({
              detail: 'Meal Not Canceled',
              summary: err.message,
              duration: 3000,
            });
          },
        });
    }
  }

  closeForm() {
    this.dialogRef.close();
  }
  
}

