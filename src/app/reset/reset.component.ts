import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { RestPasswordService } from 'src/app/Services/rest-password.service';
import { ConfirmPasswordValidator } from 'src/app/Helpers/confirm-password.validator';
import ValidateForm from 'src/app/Helpers/validateform';
import { ResetPassword } from 'src/app/models/reset-password.model';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {resestPasswordForm!: FormGroup;
  emailToRest!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: RestPasswordService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resestPasswordForm = this.fb.group(
      {
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );
    this.activatedRoute.queryParams.subscribe((val) => {
      console.log(val);
      this.emailToRest = val['email'];
      let urItoken = val['code'];
      this.emailToken = urItoken.replace(/ /g, '+');
      console.log(this.emailToken);
      console.log(this.emailToRest);
    });
  }
  reset() {
    if (this.resestPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToRest;
      this.resetPasswordObj.newPassword =
        this.resestPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword =
        this.resestPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: res.message,
            duration: 2000,
          });

          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Somthing went wrong',
            duration: 2000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.resestPasswordForm);
    }
  }
}
