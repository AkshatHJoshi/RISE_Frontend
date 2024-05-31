import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  toggleVisibility(): void {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  changePasswordForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    console.log(this.changePasswordForm);
  }

  onSubmite() {
    this.auth.changePassword(this.changePasswordForm.value).subscribe({
      next: (res) => {
        alert(res.message);
        this.changePasswordForm.reset();
        this.toast.success({
          detail: 'SUCCESS',
          summary: res.message,
          duration: 3000,
        });
        this.router.navigate(['/home']);
      },
    });
  }
}