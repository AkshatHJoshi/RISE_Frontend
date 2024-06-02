import { Component, OnInit } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { HttpClient } from '@angular/common/http';
import { QrCodeService } from '../Services/qr-code.service';
import { NgToastService } from 'ng-angular-popup';
import { Howl } from 'howler'; // Import Howler.js

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent implements OnInit {
  qrCodeData: string | null = null;
  private html5QrCode: Html5Qrcode | null = null;
  isValidUser: boolean = false;
  errorMessage: string | null = null;
  private dhanyawad: Howl = new Howl({  src: ['assets/Dhanyawad.mp3'] });    
                                     // Define a Howl instance
                                             // Path to your audio file
  constructor(private http: HttpClient, 
              private qrcodeservice: QrCodeService,
              private toast: NgToastService) {}

  ngOnInit(): void {
    // Initialize the Thank You sound
    this.dhanyawad = new Howl({
      src: ['assets/Dhanyawad.mp3'] // Path to your audio file
    });
  }

  startScanner(): void {
    this.html5QrCode = new Html5Qrcode('reader');

    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      // Handle the scanned data
      this.qrCodeData = decodedText;
      this.validateQR(this.qrCodeData); // when data fetched, validate it
      
      // Stop the scanner after successful scan
      this.html5QrCode?.stop().then(ignore => {
        document.getElementById('reader')!.style.display = 'none';
      }).catch(err => {
        console.error('Failed to stop the scanner: ', err);
      });
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      console.error('QR Code scan error: ', errorMessage);
    };

    const config = { fps: 10, qrbox: 250 };

    this.html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback)
      .catch(err => {
        console.error('Unable to start scanning', err);
      });

    document.getElementById('reader')!.style.display = 'block';
  }

  stopScanner(): void {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(ignore => {
        document.getElementById('reader')!.style.display = 'none';
      }).catch(err => {
        console.error('Failed to stop the scanner: ', err);
      });
    }
  }

  validateQR(qrdata: string): void {
    this.qrcodeservice.checkQrCode(qrdata).subscribe({
      next: (res) => {
        this.isValidUser = true;
        this.errorMessage = null;
        this.dhanyawad.play(); // Play Thank You sound
        this.toast.success({
          detail: 'User validated and Status Successfully updated',
          summary: res.message,
          duration: 5000,
        });
      },
      error: (err) => {
        this.isValidUser = false;
        const errorMessage = 'Something Went Wrong: ' + err.message;
        this.toast.error({
          detail: 'Error',
          summary: errorMessage,
          duration: 5000,
        });
        this.errorMessage = errorMessage;
      },
    });
  }
}
