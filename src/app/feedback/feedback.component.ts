import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../Services/booking.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  rating = 0;
  stars = [1, 2, 3, 4, 5];

  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toast: NgToastService
  ) {
    this.feedbackForm = this.fb.group({
      mealType: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  rate(star: number) {
    this.rating = star;
  }



  onSubmit(feedback: any) {
    if (this.feedbackForm.valid) {
      // const feedback = {
      //   mealType: this.feedbackForm.value.mealType,
      //   description: this.feedbackForm.value.description,
      //   rating: this.rating
      // };

      this.bookingService.sendFeedback(feedback).subscribe({
        next: (res: { message: any; }) => {
          this.toast.success({
            detail: 'Thank You.',
            summary: res.message,
            duration: 3000,
          });
          this.feedbackForm.reset();
          this.closeForm();
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
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
