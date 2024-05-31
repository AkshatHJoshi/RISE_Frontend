import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingComponent } from '../booking/booking.component';
import { BookingService } from '../Services/booking.service';
import { CancelBookingComponent } from '../cancel-booking/cancel-booking.component';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';
import { ViewBookingComponent } from '../view-booking/view-booking.component';
import { QuickBookingComponent } from '../quick-booking/quick-booking.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedDate!: Date | null ;
  selectedTime: string | null = null;
  bookedDates: Date[] = [];
  canceledDates: Date[] = [];
  dateFilter!: (date: Date | null) => boolean;
  allowaccess!: number;
  credit!: number;
  
  showCancelButton: boolean = false;
  showQrCodeButton: boolean = true;
  showQrCodeComponent: boolean=false;
  todays_booking!: boolean;
  mydate! : Date ;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: NgToastService,
    public dialog: MatDialog,
    private bookingservice: BookingService
  ) {
    this.fillDates();
  }

  ngOnInit() {
    console.log('in  ng on init: ',this.todays_booking)
    this.selectedDate = new Date();
    forkJoin({
      allowAccess: this.bookingservice.getAllowaccess(),
      credits: this.bookingservice.getCredits(this.selectedDate)
    }).subscribe({
      next: (res) => {
        this.allowaccess = res.allowAccess.allowAccess;
        this.credit = res.credits.credit;
        this.todays_booking = res.credits.todays_booking;
        console.log('Allow Access:', this.allowaccess); // Output the allowed access
        console.log('Credits:', this.credit); // Output the allowed days
        console.log('Todays booking:', this.todays_booking);
        this.setDateFilter();
        this.checkMealBookingForToday();
        this.checkTimeToHideQrCode();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });

    const qrCodeDisplayEndTime = localStorage.getItem('qrCodeDisplayEndTime');
    if (qrCodeDisplayEndTime) {
      const endTime = new Date(qrCodeDisplayEndTime);
      if (new Date() < endTime) {
        this.showQrCodeComponent = true;
      } else {
        this.showQrCodeComponent = false;
        localStorage.removeItem('qrCodeDisplayEndTime');
      }

    }
    console.log('seeeeeeeeeeeeeee:',this.selectedDate);
    console.log('sadasd',this.mydate);
   
  }

  setDateFilter() {
    
    this.dateFilter = (date: Date | null): boolean => {
      if (!date) {
        return false;
      }

      console.log('Allow Access:', this.allowaccess);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      if (this.allowaccess === undefined) {
        console.error('allowaccess is undefined');
        return false;
      }

      const maxDate = this.calculateMaxDate(today, this.allowaccess);
      maxDate.setHours(0, 0, 0, 0); // Reset time to compare only dates
     if (this.isWeekend(today)  ||this.isCanceled(today) )
      {
        return date > today && date <= maxDate && !this.isWeekend(date) && !this.isCanceled(date);

      }
      else{
        return date >= today && date < maxDate && !this.isWeekend(date) && !this.isCanceled(date);

      }

    };
  }

  fillDates() {
    this.canceledDates = [
      new Date('2024-01-16'), // Vassi Uttarayan (Next day to Makar Sankranti) - Monday
      new Date('2024-01-26'), // Republic Day - Friday
      new Date('2024-03-08'), // Maha Shivratri - Friday
      new Date('2024-03-25'), // Holi 2nd Day - Dhuleti - Monday
      new Date('2024-08-15'), // Independence Day - Thursday
      new Date('2024-08-19'), // Raksha Bandan - Monday
      new Date('2024-10-31'), // Diwali (Dipawali) - Thursday
    ];
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 6 || day === 0;
  }

  isCanceled(date: Date): boolean {
    return this.canceledDates.some((cancelDate) => this.isSameDate(date, cancelDate));
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  calculateMaxDate(startDate: Date, workingDays: number): Date {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < workingDays) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0 && !this.isCanceled(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  onDateSelected(event: Date | null) {////////////////////////////////////////
    if (event === null)  
      return;

    this.selectedDate = event;
    
      // calling api aging to ckeck booking status
      this.bookingservice.getCredits(this.selectedDate).subscribe({
        next: (res) => {
          this.todays_booking = res.todays_booking;
          console.log('Todays booking:', this.todays_booking);
        //  this.setDateFilter();
          this.checkMealBookingForToday();
          this.updateCancelButtonStatus(this.mydate);
         // this.checkTimeToHideQrCode();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });

    const dayName = this.getDayName(this.selectedDate);
    this.currentMenu = this.dayMenus[dayName] || { lunch: [], dinner: [] };

    const currentDate = new Date();
    
    if (this.selectedDate.toDateString() === currentDate.toDateString()) {
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:${seconds}`;
    }
   
   //this.checkMealBookingForToday();
   // this.updateCancelButtonStatus(date);

  }

 

  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  currentMenu: { lunch: string[]; dinner: string[] } = {
    lunch: [],
    dinner: [],
  };

  dayMenus: { [key: string]: { lunch: string[]; dinner: string[] } } = {
    Sunday: { lunch: [], dinner: [] },
    Monday: {
      lunch: ['Matar Paneer', 'Jeera Rice', 'Chapati', 'Raita'],
      dinner: ['Chole Bhature', 'Salad', 'Gulab Jamun'],
    },
    Tuesday: {
      lunch: ['Rajma Chawal', 'Papad', 'Pickle', 'Dahi'],
      dinner: ['Palak Paneer', 'Naan', 'Salad', 'Kheer'],
    },
    Wednesday: {
      lunch: ['Baingan Bharta', 'Paratha', 'Salad', 'Buttermilk'],
      dinner: ['Dum Aloo', 'Rice', 'Chapati', 'Halwa'],
    },
    Thursday: {
      lunch: ['Paneer Butter Masala', 'Jeera Rice', 'Chapati', 'Raita'],
      dinner: ['Vegetable Pulao', 'Raita', 'Papad', 'Rasgulla'],
    },
    Friday: {
      lunch: ['Kadhi Pakora', 'Rice', 'Papad', 'Pickle'],
      dinner: ['Aloo Gobi', 'Paratha', 'Salad', 'Ice Cream'],
    },
    Saturday: { lunch: [], dinner: [] },
  };

  openAddBookingDialog() {
    this.dialog.open(BookingComponent);
  }

  openCancelBookingDialog() {
    this.dialog.open(CancelBookingComponent, {
      data: {
        selectedDate: this.selectedDate,
      }
    });
  }

  openViewBookingDialog() {
    this.dialog.open(ViewBookingComponent);
  }

  openQuickBookingDialog(){
    this.dialog.open(QuickBookingComponent);
  }

  logout() {
    this.auth.signOut();
  }

  signgout() {
    this.auth.signOut();
  }

   openQrCodeDialog() {
    this.showQrCodeComponent = true;
    this.showQrCodeButton = false;
    const displayDurationMinutes = 15; // Set your desired display duration in minutes
    const displayEndTime = new Date(
      new Date().getTime() + displayDurationMinutes * 60000
    );
    localStorage.setItem('qrCodeDisplayEndTime', displayEndTime.toISOString()); // Store the end time in local storage
    // this.dialog.open(CouponComponent, {
    //   data: { selectedDate: this.selectedDate },
    // });

    localStorage.setItem('qrCodeButtonClicked', 'true');
  }

  

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
 checkMealBookingForToday(): void {
    const currentDate = new Date();
   // const selectedDate = this.selectedDate;
   if (this.selectedDate == null)
   { this.mydate  = new Date();}
   else{this.mydate = this.selectedDate;}
   console.log('sadasd',this.mydate);//////////////
    const isToday = this.isSameDay(currentDate, this.mydate);
    console.log('istoday',isToday);
    console.log('isbooked',this.todays_booking);
    const currentHour = currentDate.getHours();

    const qrCodeButtonClicked =
      localStorage.getItem('qrCodeButtonClicked') === 'true';


    if (isToday && currentHour >= 12 && currentHour < 14) {
      this.showQrCodeButton = this.todays_booking && !qrCodeButtonClicked; // Replace with actual meal booking check
    } else {
      this.showQrCodeButton = false;
    }
  }

  checkTimeToHideQrCode(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
   

    if (currentHour >= 14)  //this will not show qrcode and button after 2pm
      {
      this.showQrCodeComponent = false;
      this.showQrCodeButton = false;
      localStorage.removeItem('qrCodeDisplayEndTime'); // Clear the stored end time
    }
  }

  updateCancelButtonStatus(date: Date): void {
    const currentDate = new Date(); // Get the current date and time

    // Calculate tomorrow's date
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
    tomorrowDate.setHours(0, 0, 0, 0); // Set time to start of the day

    // Calculate today's 10 PM
    const todayAt10PM = new Date(currentDate);
    todayAt10PM.setHours(22, 0, 0, 0); // Set time to 10 PM today

    // Check if the selected date is tomorrow
    const isTomorrow = this.isSameDay(date, tomorrowDate);

    // Check if the current time is before 10 PM today
    const before10PM = currentDate < todayAt10PM;

    // Check if the selected date is a weekday
    const isWeekday = date.getDay() !== 0 && date.getDay() !== 6;

    // Check if the selected date is today
    const isToday = this.isSameDay(date, currentDate);

    if (isTomorrow) {
      this.showCancelButton =
        this.isSameDay(date, tomorrowDate ) &&
        isWeekday &&
        before10PM &&
        this.todays_booking; // Show the cancel button if the meal is booked for tomorrow, it's a weekday, and before 10 PM today
    } else if (!isToday) {
      // Show cancel button for other days (excluding today) without time constraint
      this.showCancelButton =
        isWeekday &&
        this.todays_booking; // Show the cancel button if the meal is booked for any day other than today, it's a weekday, and date is not in the past
    } else {
      // Do not show the cancel button for today
      this.showCancelButton = false;
    }
  }
 
}

