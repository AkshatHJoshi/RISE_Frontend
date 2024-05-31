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
    

    const dayIndex = this.tomorrow.getDay();
    
    if (dayIndex === 6) {
      // If tomorrow is Saturday, move to Monday
      this.tomorrow.setDate(this.tomorrow.getDate() + 3);  //that 1 day extrs for toISOString()
      this.displayDay = 'Monday';
    }
     else if (dayIndex === 0) {
      // If tomorrow is Sunday, move to Monday
      this.tomorrow.setDate(this.tomorrow.getDate() + 2);  //that 1 day extrs for toISOString()
      this.displayDay = 'Monday';
    } 
    else {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.displayDay = daysOfWeek[dayIndex];
    }

    // Format the date as YYYY-MM-DD
    this.tomorrowdate = this.tomorrow.toISOString().split('T')[0];// this method is based on UTC 
                                                                  // if we are in behind UTC timezone 
                                                                  //then it gives previous date
                                                                  // so increase 1 day extra in this.tomorrow
   // console.log(this.tomorrow);
   // console.log(this.tomorrowdate);
   
 
    
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
