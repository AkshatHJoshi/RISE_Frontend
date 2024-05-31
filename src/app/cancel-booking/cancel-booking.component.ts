import { Component, Inject, Input } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent {
 selectedDate!:Date;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date },
    private bookingservice: BookingService,
    private toast: NgToastService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<CancelBookingComponent>
    
  ) {
    this.selectedDate = data.selectedDate;
  }

  ngOnInit(): void {
    console.log(this.selectedDate);
  }

  Logout() {
    this.auth.signOut();
    this.closeForm();
  }
  cancelBooking(): void {
    this.bookingservice.doCancelBooking(this.selectedDate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Meal Canceled',
          summary: res.message,
          duration: 3000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'Meal Not Canceled',
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

