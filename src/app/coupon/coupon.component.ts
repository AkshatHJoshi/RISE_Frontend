import { Component, Input, OnInit , } from '@angular/core';
import { QrCodeService } from '../Services/qr-code.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {
  selectedDate: Date = new Date();
  qrdata: string = ''; // Initialize qrdata with an empty string
  showQRCode: boolean = false; // Initialize showQRCode to false
  isExpired: boolean = false; // Initialize isExpired to false
  showBtn: boolean = false; // Set showBtn to false to hide the button
  qrcode!: string ;
  name!:string;

   constructor ( private qrcodeservice :QrCodeService,private toast: NgToastService){
    
   }

  ngOnInit(): void {
    // Generate the QR code when the component initializes
    
      allowAccess: this.qrcodeservice.generateQrCode().subscribe({
      next: (res) => {
        this.qrcode = res.couponCode;
          this.name= res.firstName;
        this.generateQRCode();
        this.toast.success({

          detail: 'Genrated',
          summary: res.message,
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error fetching QR:', error);
        this.toast.error({
          detail: 'Not Genrated',
          summary: error.message,
          duration: 3000,
        });
      }
    });
   
  }

  generateQRCode() {
   
    
    // pass qrcode in html
    this.qrdata = this.qrcode;
    
    
    console.log( 'huygty',this.qrdata);
    
    this.showQRCode = true; // Show the QR code
    this.isExpired = false; // Reset the expiration status
  }
}
