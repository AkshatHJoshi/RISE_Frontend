import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NotificationComponent } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
   fullName!: string ; // Initialize with an empty string
  showFiller = false;
  NotificationCount: number = 0; // Initialize with zero

  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';

  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private notification: NotificationService,
    public dialog: MatDialog,
    private router: Router // Inject the Router service
  ) {}

  ngOnInit() {
    this.getfirstname();
    this.countnoti();
  }

  countnoti() {
    this.notification.notificationcount().subscribe({
      next: (res) => {
        this.NotificationCount = res.notificationCount; 
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  getfirstname() {
    this.notification.username().subscribe({
      next: (res) => {
        this.fullName = res.name; 
        console.log("User Full Name: ", this.fullName); // Ensure this logs the correct name
      },
      error: (error) => {
        console.error('Error fetching first name:', error);
      }
    });
  }

  openSidebar() {
    this.dialog.open(SidebarComponent);
  }

  openNotification() {
    this.countnoti();
    this.dialog.open(NotificationComponent);
  }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  logout() {
    this.auth.signOut();
  }

  // Method to navigate to home
  navigateToHome() {
    this.countnoti();
    this.getfirstname();
    this.router.navigate(['/home']); // Or '/dashboard' or any other route
  }
}
