import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminheader',
  templateUrl: './adminheader.component.html',
  styleUrls: ['./adminheader.component.css']
})
export class AdminheaderComponent {
  constructor(
    private router: Router // Inject the Router service
  ) {}

  navigateToHome() {
    
    this.router.navigate(['/admin']);// redirect admin home 
  }
}
