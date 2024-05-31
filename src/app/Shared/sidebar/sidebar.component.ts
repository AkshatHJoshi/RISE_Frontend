import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/auth.service';
import { LogoutComponent } from 'src/app/logout/logout.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SidebarComponent>
  ) {}

  openLogoutDialog() {
    this.dialog.open(LogoutComponent);
    this.closeSidebar();
  }

  onclick() {
    this.closeSidebar();
  }

  closeSidebar() {
    this.dialogRef.close();
  }

}
