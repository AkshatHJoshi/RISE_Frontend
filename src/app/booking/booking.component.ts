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
import { Subscription } from 'rxjs';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';

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
 

  constructor(
    private fb: FormBuilder,
    private book: BookingService,
    public dialogRef: MatDialogRef<BookingComponent>,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
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

  closeForm() {
    this.dialogRef.close();
  }

  bookMeal(): void {
    console.log(this.addbookingForm);
    const jwtToken = localStorage.getItem('token');
    

    if (jwtToken) {
      
      this.book.addBooking(this.addbookingForm.value).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Meal Booked',
            summary: res.message,
            duration: 3000,
          });
          this.addbookingForm.reset();
          this.closeForm();
        },
        error: (err) => {
          this.toast.error({
            detail: 'Meal Not Booked',
            summary: err.message,
            duration: 3000,
          });
        },
      });
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
