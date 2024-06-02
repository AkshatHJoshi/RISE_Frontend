import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import ValidateForm from 'src/app/Helpers/validateform';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm!: FormGroup;

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  public isValidEmail!: boolean;
  public restPasswordEmail!: string;

  toggleVisibility(): void {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  constructor(
    private toast: NgToastService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'user is registered!',
            summary: res.message,
            duration: 3000,
          });
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'error',
            summary: err.message,
            duration: 3000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.signupForm);
      alert('Form is invalid');
    }
  }
}
