  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from '../login/login.component';
// import { SignupComponent } from '../signup/signup.component';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';
import { ResetComponent } from '../reset/reset.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { SharedModule } from '../Shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { CouponComponent } from '../coupon/coupon.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    // SignupComponent,
    ForgotpasswordComponent,
    ResetComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    HomeComponent,
    CouponComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,QRCodeModule,MatDatepickerModule,
  ],
})
export class DashboardModule {}
