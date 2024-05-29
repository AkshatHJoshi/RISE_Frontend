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

// -----------------------------------------------------


@NgModule({
  declarations: [
    
    AppComponent,
    CalendarComponent,
    BookingComponent,
    ViewBookingComponent,
    CancelBookingComponent,
  ],
  imports: [
    //-------
    BrowserModule,
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
    MatIconModule,
    FormsModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatRadioModule,
    SharedModule,NgxQrcodeStylingModule,
    

    MatRadioModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
