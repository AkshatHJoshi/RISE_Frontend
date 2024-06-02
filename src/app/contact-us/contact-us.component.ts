import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { BookingService } from '../Services/booking.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  FormData!: FormGroup;
 
  

  constructor(private builder: FormBuilder,private bookingService: BookingService,
    private toast: NgToastService,) {}

  ngOnInit() {
    this.FormData = this.builder.group({
      Fullname: new FormControl('', { validators: [Validators.required] }),
      Email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      Subject: new FormControl('', { validators: [Validators.required] }),
      Comment: new FormControl('', { validators: [Validators.required] }),
    });
  }

  contectdata()
  {   
    if (this.FormData.valid) {

   
    // Pass selected date, meal type to the cancel booking service
    this.bookingService.sendcontectdata(this.FormData.value).subscribe({
           next: (res: { message: any; }) => {
            this.toast.success({
              detail: 'Message Submitted',
              summary: res.message,
              duration: 3000,
            });
           
          },
          error: (err) => {
            this.toast.error({
              detail: 'Message not Submitted',
              summary: err.message,
              duration: 3000,
            });
          },
        });
  }
}
  
  onSubmit(FormData: any) {
    this.contectdata();
    this.FormData.reset();
  }
}