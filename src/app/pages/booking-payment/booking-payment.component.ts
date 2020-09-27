import { Component, OnInit, HostListener } from '@angular/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {

  amount = 500;
  handler: any;

  loader: boolean;
  elements: Elements;
  card: StripeElement;

  bookingInfo: Booking;
  stripeTest: FormGroup;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  @HostListener('window:popstate' , ['$event'])
  onpopstate(event) {
    this.handler.close();
  }
  constructor(private fb: FormBuilder, private stripeService: StripeService,
              private snack: MatSnackBar, private router: Router,
              private serv: BookingService, private global: GlobalService) { }

  ngOnInit(): void {

    this.loader = false;
    this.stripeTest = this.fb.group({
      name: ['' , Validators.required]
    });
    this.bookingInfo = JSON.parse(localStorage.getItem('itinerary'));
    this.serv.getClientFromSession(JSON.parse(sessionStorage.getItem('session')),
                                  this.global.GetServer()).subscribe(res => {
                                    console.log(res);
                                    this.bookingInfo.ClientID = res.ClientID;
                                    localStorage.setItem('itinerary', JSON.stringify(this.bookingInfo));
                                    console.log(this.bookingInfo);
                                    sessionStorage.setItem('session', JSON.stringify(res.Session)); },
                                    (error: HttpErrorResponse) => this.openSnack(error));
    this.amount = this.bookingInfo.PaymentAmount;
    this.stripeService.elements(this.elementsOptions)
    .subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          iconStyle: 'solid',
          style: {
            base: {
              iconColor: '#c4f0ff',
              color: '#fff',
              fontWeight: 500,
              fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              fontSize: '16px',
              fontSmoothing: 'antialiased',
              ':-webkit-autofill': {
                color: '#fce883',
              },
              '::placeholder': {
                color: '#87BBFD',
              },
            },
            invalid: {
              iconColor: '#FFC7EE',
              color: '#FFC7EE',
            },
          },
        });
        this.card.mount('#example1-card');
        // registerElements([this.card], 'example1');
    }
  });
  }

  openSnack(message) {
    this.snack.open(message, 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  handlePayment() {
    this.serv.getClientFromSession(JSON.parse(sessionStorage.getItem('session')), this.global.GetServer()).subscribe(res => {
      console.log(res);
      this.bookingInfo.ClientID = res.ClientID;
      localStorage.setItem('itinerary', JSON.stringify(this.bookingInfo));
      console.log(this.bookingInfo);
      sessionStorage.setItem('session', JSON.stringify(res.Session)); },
      (error: HttpErrorResponse) => this.openSnack(error.message));
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, {})
      .subscribe(result => {
        if (result) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          this.loader = true;
          this.bookingInfo = JSON.parse(localStorage.getItem('itinerary'));
          this.bookingInfo.paymentToken = result.token.id;
          console.log(this.bookingInfo.paymentToken);
          const sess = JSON.parse(sessionStorage.getItem('session'));
          this.bookingInfo.Session = sess;
          localStorage.setItem('itinerary', JSON.stringify(this.bookingInfo));
          this.serv.SaveBooking(this.bookingInfo , this.global.GetServer()).subscribe(data => {
            if (data.Success) {
              this.loader = false;
              console.log('Success!!');
              sessionStorage.setItem('session', JSON.stringify(data.Session));
              this.snack.open('You have successfully made a booking', 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
              });
              localStorage.removeItem('itinerary');
              this.router.navigateByUrl('bookingSuccess');
            } else {
              if (data.Session.Error) {
                const login = this.snack.open(data.Session.Error, 'Okay', {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });

                login.afterDismissed().subscribe(() => this.router.navigateByUrl('Login'));
              } else {
                this.openSnack(data.Message);
              }
            }
          });
        } else if (result.error) {
          // Error creating the token
          this.snack.open(result.error.message, 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
  }
  Success() {
    this.snack.open('Unsuccessful Payment', 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
