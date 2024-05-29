import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public fullName: string = 'Arnov';
  showFiller = false;

  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';

  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
  }
  openSidebar() {
    this.dialog.open(SidebarComponent);
  }

  openNotification() {
   // this.dialog.open(NotificationComponent);
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
}
