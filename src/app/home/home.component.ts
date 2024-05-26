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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  bookedDates: Date[] = [];
  canceledDates: Date[] = [];
  dateFilter!: (date: Date | null) => boolean;
  allowaccess!: number;
  credit!: number;
  showCancelButton: boolean = false;

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
    forkJoin({
      allowAccess: this.bookingservice.getAllowaccess(),
      credits: this.bookingservice.getCredits()
    }).subscribe({
      next: (res) => {
        this.allowaccess = res.allowAccess.allowAccess;
        this.credit = res.credits.credit;
        console.log('Allow Access:', this.allowaccess); // Output the allowed access
        console.log('Credits:', this.credit); // Output the allowed days
        this.setDateFilter();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
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

      return date > today && date <= maxDate && !this.isWeekend(date) && !this.isCanceled(date);
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
    if (event === null) return;

    const selectedDate = event;
    const dayName = this.getDayName(selectedDate);
    this.currentMenu = this.dayMenus[dayName] || { lunch: [], dinner: [] };

    const currentDate = new Date();

    if (selectedDate.toDateString() === currentDate.toDateString()) {
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:${seconds}`;
    }
  }

  cancelBooking(): void {
    this.bookingservice.doCancelBooking(this.selectedDate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Meal Canceled',
          summary: res.message,
          duration: 3000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'Meal Not Canceled',
          summary: err.message,
          duration: 3000,
        });
      },
    });
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
    this.dialog.open(CancelBookingComponent);
  }

  openViewBookingDialog() {
    this.dialog.open(BookingComponent);
  }

  logout() {
    this.auth.signOut();
  }

  signgout() {
    this.auth.signOut();
  }
}
