import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {private baseUrl: string = 'https://localhost:7205/api/Notification/';
private baseUrl2: string = 'https://localhost:7205/api/User/';

constructor(private http: HttpClient, private router: Router) {}

getNotification() {
  const email = localStorage.getItem('email');
  console.log(email);
  const viewNotificationObj = {
    email: email,
  };

  return this.http.post<any>(
    `${this.baseUrl}Show_notifications`,
    viewNotificationObj
  );
}

username()
{
  const email = localStorage.getItem('email');
  console.log(email);
  const firstObj = {
    username: email,
  };

  return this.http.post<any>(
    `${this.baseUrl2}getfirstname`,firstObj
  );
}



notificationcount()
{
  const email = localStorage.getItem('email');
  console.log(email);
  const countNotificationObj = {
    email: email,
  };

  return this.http.post<any>(
    `${this.baseUrl}Count_notifications`,
    countNotificationObj
  );
}

deleteNotificationsbyindex(index: number) {
  const email = localStorage.getItem('email');
  console.log(email);
  const deleteNotificationObj = {
    email: email,
    index: index
  };

  return this.http.delete<any>(
    `${this.baseUrl}DeleteNotificationByIndex`,
    {
      body: deleteNotificationObj
    }
  );

}

deleteAllNotifications()
{
   const email = localStorage.getItem('email');
  console.log(email);
  const deleteALLNotificationObj = {
    email: email
  };

  return this.http.delete<any>(
    `${this.baseUrl}deleteAll_notifications`,
    {
      body: deleteALLNotificationObj
    }
  );

}
}
