import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';
import { RestPasswordService } from 'src/app/Services/rest-password.service';
import ValidateForm from 'src/app/Helpers/validateform';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotpasswordComponent {
  public restPasswordEmail!: string;
  public isValidEmail!: boolean;

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private resetService: RestPasswordService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Email: ['', Validators.required],
    });
  }

  onLogin() {}

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/; //rejex pattern for checking email pattern
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.restPasswordEmail)) {
      console.log(this.restPasswordEmail);

      //apicall
      this.resetService.sendRestPasswordLink(this.restPasswordEmail).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Reset Success!',
            duration: 3000,
          });

          this.restPasswordEmail = '';
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Somthing went wrong!',
            duration: 3000,
          });
        },
      });
    }
  }
}
