import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../Services/notification.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  isNotificationSidebarActive = false;
  notification:any[] = []; // Ensure type matches the structure of the response

  constructor(
    private notificationService: NotificationService,
    private toast: NgToastService,
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notification: { description: string }[] }
  ) {}

  @Output() notificationsCleared = new EventEmitter<void>();

  ngOnInit() {
    this.fetchNotifications();
    this.openNotificationSidebar();
  }

  fetchNotifications() {
    this.notificationService.getNotification().subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.notification = res; // Assign only if the response is an array
          this.data.notification = res; // Ensure the injected data reflects this
        } else {
          console.error('Unexpected response format', res);
        }
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  openNotificationSidebar() {
    this.isNotificationSidebarActive = true;
  }

  closeNotificationSidebar() {
    this.isNotificationSidebarActive = false;
    this.dialogRef.close();
  }

  removeNotification(index: number): void {
    this.deleteNotification(index);

  }

  deleteNotification(index: number): void {
    this.notificationService.deleteNotificationsbyindex(index).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Notification deleted',
          summary: res.message,
          duration: 3000,
        });

        // Remove the notification from the local list
        this.notification.splice(index, 1);
        this.data.notification.splice(index, 1);
        
        // Update the local storage if needed
        this.updateLocalStorage();
      },
      error: (err) => {
        this.toast.error({
          detail: 'Notification not deleted',
          summary: err.message,
          duration: 3000,
        });
      },
    });
  }

  updateLocalStorage(): void {
    localStorage.setItem('notifications', JSON.stringify(this.data.notification));
  }

  deleteNotifications()
  {
    this.notificationService.deleteAllNotifications().subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'All Notifications are Removed',
          summary: res.message,
          duration: 3000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'Something Went Wrong',
          summary: err.message,
          duration: 3000,
        });
      },
    });

  }
}

