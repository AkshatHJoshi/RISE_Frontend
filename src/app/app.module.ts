import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CalendarComponent } from './calendar/calendar.component';

import { NativeDateModule } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { BookingComponent } from './booking/booking.component';
import { FormsModule } from '@angular/forms'; // Required for ngModel

import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling'


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { SharedModule } from './Shared/shared.module';

import { NotificationComponent } from './notification/notification.component';
import { QuickBookingComponent } from './quick-booking/quick-booking.component';
import { MatDividerModule } from '@angular/material/divider';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LogoutComponent } from './logout/logout.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';

import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { SignupComponent } from '../app/signup/signup.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AdmincreditComponent } from './admincredit/admincredit.component';
import { AdminheaderComponent } from './adminheader/adminheader.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
// -----------------------------------------------------


@NgModule({
  declarations: [
    SignupComponent,
    AppComponent,
    CalendarComponent,
    BookingComponent,
    ViewBookingComponent,
    CancelBookingComponent,
    NotificationComponent,
    QuickBookingComponent,
    ContactUsComponent,
    ChangePasswordComponent,
    LogoutComponent,
    QrCodeScannerComponent,
    FeedbackComponent,
    AdmincreditComponent,
    AdminheaderComponent,
    AdminhomeComponent,
    
  ],
  imports: [
    //-------
    BrowserModule,
    MatGridListModule,
    MatToolbarModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgToastModule,
    MatDatepickerModule,
    MatFormFieldModule,
    NativeDateModule,
    MatNativeDateModule,
    
    FormsModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatRadioModule,
    SharedModule,NgxQrcodeStylingModule,    
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    
    
    
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
