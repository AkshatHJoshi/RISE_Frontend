import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-admincredit',
  templateUrl: './admincredit.component.html',
  styleUrls: ['./admincredit.component.css']
})
export class AdmincreditComponent {creditForm: FormGroup;
  emails: string[] = [];

  constructor(private fb: FormBuilder, private authservice: AuthService,private toast: NgToastService) {
    this.creditForm = this.fb.group({
      email: ['', Validators.required],
      credits: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
   
  }

  onSubmit(): void {
    
    if (this.creditForm.valid) {
      const mealType = this.creditForm.value;
      console.log('Form Data:', { mealType });
      this.authservice.setCredit(this.creditForm.value).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Credits set successfully.',
            summary: res.message,
            duration: 3000,
          });
        },
        error: (err) => {
          this.toast.error({
            detail: 'something error.',
            summary: err.message,
            duration: 3000,
          });
        },
      });
    }
    this.creditForm.reset();
  }
}
