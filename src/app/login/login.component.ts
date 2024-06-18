import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { HttpEventType, HttpClient } from '@angular/common/http';
import ValidateForm from 'src/app/Helpers/validateform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  isLoading: boolean = false; // Loading state
  progress: number = 0; // Progress state

  toggleVisibility(): void {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true; // Show loader
      this.progress = 0; // Reset progress

      const email = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      if (email === 'admin@gmail.com' && password === 'AJ&10') {
        this.router.navigate(['/admin']);
        this.isLoading = false; // Hide loader
        return;
      }

      console.log(this.loginForm.value);
      localStorage.setItem('email', this.loginForm.value.username);
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.auth.storeTokan(res.token);
          const tokenPayload = this.auth.decodeToken();
          this.userStore.setFullNameFromStore(tokenPayload.role);
          this.toast.success({
            detail: 'SUCCESS',
            summary: res.message,
            duration: 3000,
          });

          this.router.navigate(['/home']);
          this.isLoading = false; // Hide loader
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Something went wrong!',
            duration: 5000,
          });
          this.isLoading = false; // Hide loader
          console.log(err);
        },
        complete: () => {
          this.progress = 100; // Set progress to 100% when complete
          setTimeout(() => {
            this.isLoading = false; // Hide loader
          }, 500); // Optional: delay to show 100% progress
        }
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Form is invalid');
    }
  }
}
