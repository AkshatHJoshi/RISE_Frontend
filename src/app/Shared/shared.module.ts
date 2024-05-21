import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent],

  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatCardModule, MatDatepickerModule],
  exports: [FooterComponent, HeaderComponent, SidebarComponent, MatCardModule, MatDatepickerModule],
})
export class SharedModule {}
