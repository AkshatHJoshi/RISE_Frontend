import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, catchError, forkJoin } from 'rxjs';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';
import { HttpErrorResponse } from '@angular/common/http';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  addbookingForm!: FormGroup;
  isFormVisible = true;
  Mindate = new Date();
  Maxdate = new Date();
  allowaccess: any;
 

  constructor(
    private fb: FormBuilder,
    private book: BookingService,
    public dialogRef: MatDialogRef<BookingComponent>,
    private toast: NgToastService,
    private bookingservice: BookingService
  ) {
    
  }

  ngOnInit(): void {
    forkJoin({
      allowAccess: this.bookingservice.getAllowaccess(),
      
    }).subscribe({
      next: (res) => {
        this.allowaccess = res.allowAccess.allowAccess;
       
        console.log('Allow Access:', this.allowaccess); // Output the allowed access
        this.Maxdate= this.calculateMaxDate(this.Mindate, this.allowaccess)
        console.log('maxdate:' ,this.Maxdate);  // 
        console.log('mindate:',this.Mindate);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
    this.addbookingForm = this.fb.group({
      BookingType: ['', Validators.required],
      admDateRange: this.fb.group(
        {
          startDate: [new Date(), Validators.required],
          endDate: [new Date(), Validators.required],
        },
        { validators: this.dateRangeValidator }
      ),
    });
  }

  calculateMaxDate(startDate: Date, allowedDays: number): Date {
    let date = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < allowedDays) {
      date.setDate(date.getDate() + 1);
      // Skip Saturday (6) and Sunday (0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysAdded++;
      }
    }

    return date;
  }

  closeForm() {
    this.dialogRef.close();
  }

  bookMeal(): void {
    console.log(this.addbookingForm);
    const jwtToken = localStorage.getItem('token');
    

    if (jwtToken) {
      
      this.book.addBooking(this.addbookingForm.value).subscribe({
        next: (res) => {
          console.log('innext:',res);
          this.toast.success({

            detail: 'Meal Booked',
            summary: res.message,
            duration: 3000,
          });
          this.addbookingForm.reset();
          this.closeForm();
        },
        error: (err) => {
          console.log('error:',err);
          console.log('error:', err?.message);
         
          this.toast.error({
            detail: 'Meal Not Booked',
            summary: err.message,
            duration: 3000,
          });
        },
      });
      // this.book.addBooking(this.addbookingForm.value).pipe(
      //   catchError((error: HttpErrorResponse) => {
      //     console.log("error",error);
      //   }) 
      // )
    }

  }

  dateRangeValidator(control: FormGroup): { [key: string]: boolean } | null {
    const startDate : Date = control.get('startDate')?.value
      const nextStartDay = new Date(startDate);
      nextStartDay.setDate(startDate.getDate() + 1);
                                                      // add 1 day because it takes lnday previous
  
    const endDate : Date = control.get('endDate')?.value;
      const nextEndday = new Date(endDate);
      nextEndday.setDate(endDate.getDate() + 1);
    
    if (nextStartDay && nextEndday && nextStartDay >= nextEndday) {
      return { invalidRange: true };
    }
    return null;
  }

  hasMatStartDateError(): boolean {
    const startDateControl = this.addbookingForm
      .get('admDateRange')
      ?.get('startDate');
    return (
      !!startDateControl && startDateControl.hasError('matStartDateInvalid')
    );
  }

  hasMatEndDateError(): boolean {
    const endDateControl = this.addbookingForm
      .get('admDateRange')
      ?.get('endDate');
    return !!endDateControl && endDateControl.hasError('matEndDateInvalid');
  }
}
