import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './Shared/header/header.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResetComponent } from './reset/reset.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CouponComponent } from './coupon/coupon.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./Dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
  { path: '', component: LoginComponent },
  // { path: 'header', component:HeaderComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'coupon', component:CouponComponent },
  //{ path: 'booking', component: BookingComponent,canActivate: [authGuard] },
  { path: 'home', component: HomeComponent , canActivate: [authGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'forget', component: ForgotpasswordComponent },
  { path: 'reset', component: ResetComponent, canActivate: [authGuard] },
 // { path: 'view', component:ViewBookingComponent },
  { path: 'contact', component:ContactUsComponent, canActivate: [authGuard] },
  { path: 'aboutus', component: AboutUsComponent, canActivate: [authGuard] },
  { path: 'policy',component: PrivacyPolicyComponent,canActivate: [authGuard], },

     {
    path: 'terms',
    component: TermsAndConditionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'Change',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
