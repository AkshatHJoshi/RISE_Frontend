import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent {
  isAgreed = false;

  onAgreeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isAgreed = checkbox.checked;
  }

  onSubmit(): void {
    if (this.isAgreed) {
      // Add your form submission logic here
      alert('Form submitted');
    }
  }
}
