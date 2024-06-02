import { forkJoin } from "rxjs";
import { BookingComponent } from "../booking/booking.component";
import { CancelBookingComponent } from "../cancel-booking/cancel-booking.component";
import { QuickBookingComponent } from "../quick-booking/quick-booking.component";
import { ViewBookingComponent } from "../view-booking/view-booking.component";
import { BookingService } from "../Services/booking.service";
import { MatDialog } from "@angular/material/dialog";
import { NgToastService } from "ng-angular-popup";
import { AuthService } from "../Services/auth.service";
import { ApiService } from "../Services/api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedDate!: Date | null;
  selectedTime: string | null = null;
  bookedDates: Date[] = [];
  canceledDates: Date[] = [];
  dateFilter!: (date: Date | null) => boolean;
  allowaccess!: number;
  credit!: number;
  
  showCancelButton: boolean = false;
  showQrCodeButton: boolean = false;
  showQrCodeComponent: boolean = false;
  todays_booking!: boolean;
  mydate!: Date;

  todbokd: boolean = true;

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
    console.log('in ng on init: ', this.todays_booking)
    this.selectedDate = new Date();
    forkJoin({
      allowAccess: this.bookingservice.getAllowaccess(),
      credits: this.bookingservice.getCredits(this.selectedDate)
    }).subscribe({
      next: (res: { allowAccess: { allowAccess: number; }; credits: { credit: number; todays_booking: boolean; }; }) => {
        this.allowaccess = res.allowAccess.allowAccess;
        this.credit = res.credits.credit;
        this.todays_booking = res.credits.todays_booking;
        console.log('Allow Access:', this.allowaccess); // Output the allowed access
        console.log('Credits:', this.credit); // Output the allowed days
        console.log('Todays booking:', this.todays_booking);
        this.setDateFilter();
        this.checkMealBookingForToday();
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });

    const qrCodeDisplayEndTime = localStorage.getItem('qrCodeDisplayEndTime');
    if (qrCodeDisplayEndTime) {
      const endTime = new Date(parseInt(qrCodeDisplayEndTime, 10));  // 10 used for decimal
      if (new Date() < endTime) {
        this.showQrCodeComponent = true;
        const remainingTime = endTime.getTime() - new Date().getTime();
        setTimeout(() => {
          this.showQrCodeComponent = false;
          localStorage.removeItem('qrCodeDisplayEndTime');
        }, remainingTime);
      } else {
        this.showQrCodeComponent = false;
        localStorage.removeItem('qrCodeDisplayEndTime');
      }
    }

    // Set the menu for today by default
    this.updateMenuForSelectedDate(this.selectedDate);

    console.log('seeeeeeeeeeeeeee:', this.selectedDate);
    console.log('sadasd', this.mydate);
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
      if (this.isWeekend(today) || this.isCanceled(today)) {
        return date > today && date <= maxDate && !this.isWeekend(date) && !this.isCanceled(date);
      } else {
        return date >= today && date <= maxDate && !this.isWeekend(date) && !this.isCanceled(date);
      }
      // i am not counting today because user can't booked for today 
      // from here it is required to enable today
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

  onDateSelected(event: Date | null) {
    if (event === null)  
      return;

    this.selectedDate = event;
    
    // calling api again to check booking status
    this.bookingservice.getCredits(this.selectedDate).subscribe({
      next: (res: { todays_booking: boolean; }) => {
        this.todays_booking = res.todays_booking;
        console.log('Todays booking:', this.todays_booking);
        this.checkMealBookingForToday();
        this.updateCancelButtonStatus(this.mydate);
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });

    // Update the menu for the selected date
    this.updateMenuForSelectedDate(this.selectedDate);

    const currentDate = new Date();
    
    if (this.selectedDate.toDateString() === currentDate.toDateString()) {
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:${seconds}`;
    }
  }

  updateMenuForSelectedDate(date: Date): void {
    const dayName = this.getDayName(date);
    this.currentMenu = this.dayMenus[dayName] || { lunch: [], dinner: [] };
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

  openQuickBookingDialog() {
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

    setTimeout(() => {
      this.showQrCodeComponent = false;
      localStorage.removeItem('qrCodeDisplayEndTime');
    }, 15 * 60000);                                   // 15 minutes in milliseconds
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
    if (this.selectedDate == null) {
      this.mydate = new Date();
    } else {
      this.mydate = this.selectedDate;
    }
    const isToday = this.isSameDay(currentDate, this.mydate);
   
    console.log('isbooked', this.todays_booking);
    const currentHour = currentDate.getHours();

    if (isToday && (   (currentHour >= 1 && currentHour < 5) || (currentHour >= 20 && currentHour < 22) )  && this.todays_booking) {
      console.log("currentttttttttHour", isToday);
      this.showQrCodeButton = true;
    } else {
      this.showQrCodeButton = false;
      this.showQrCodeComponent = false;
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
        this.isSameDay(date, tomorrowDate) &&
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
