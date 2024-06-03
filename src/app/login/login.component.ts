 import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
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
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() 
  {
    
    if (this.loginForm.valid) {
     
      const email = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      if (email === 'admin@gmail.com' && password === 'AJ&10') {
        // Redirect to scanner page if admin credentials match
        this.router.navigate(['/admin']);
        return; // Exit the function
      }

      console.log(this.loginForm.value);
      localStorage.setItem('email',this.loginForm.value.username)
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          //alert(res.message);
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
        },
        error: (err) => {
          // alert(err?.error.message);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Somthing whent wrong!',
            duration: 5000,
          });
          console.log(err);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Form is invalid');
    }
  }
  checkValidEmail(event: String) {}
}


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NgToastService } from 'ng-angular-popup';
// import { AuthService } from 'src/app/Services/auth.service';
// import { UserStoreService } from 'src/app/Services/user-store.service';
// import ValidateForm from 'src/app/Helpers/validateform';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router,
//     private toast: NgToastService,
//     private userStore: UserStoreService
//   ) {}

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//     });
//   }

//   onLogin() {
//     if (this.loginForm.valid) {
//       const email = this.loginForm.value.username;
//       const password = this.loginForm.value.password;

//       if (email === 'abc@gmail.com' && password === 'AH&120') {
//         // Redirect to scanner page if admin credentials match
//         this.router.navigate(['/scanner']);
//         return; // Exit the function
//       }

//       this.auth.login(this.loginForm.value).subscribe({
//         next: (res) => {
//           //alert(res.message);
//           this.loginForm.reset();
//           this.auth.storeTokan(res.token);
//           const tokenPayload = this.auth.decodeToken();
//           this.userStore.setFullNameFromStore(tokenPayload.role);
//           this.toast.success({
//             detail: 'SUCCESS',
//             summary: res.message,
//             duration: 3000,
//           });

//           this.router.navigate(['/home']);
//         },
//         error: (err) => {
//           // alert(err?.error.message);
//           this.toast.error({
//             detail: 'ERROR',
//             summary: 'Something went wrong!',
//             duration: 5000,
//           });
//           console.log(err);
//         },
//       });
//     } else {
//       ValidateForm.validateAllFormFields(this.loginForm);
//       alert('Form is invalid');
//     }
//   }

//   checkValidEmail(event: String) {}
// }
