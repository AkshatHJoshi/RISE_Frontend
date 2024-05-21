import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { authGuard } from '../guards/auth.guard';
import { CalendarComponent } from '../calendar/calendar.component';
import { BookingComponent } from '../booking/booking.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutUsComponent, canActivate: [authGuard] },
  {
    path: 'policy',
    component: PrivacyPolicyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'terms',
    component: TermsAndConditionsComponent,
    canActivate: [authGuard],
  },
  { path: 'calander', component: CalendarComponent, canActivate: [authGuard] },
  {
    path: 'booking',
    component:BookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
