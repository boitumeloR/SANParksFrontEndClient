import { Component, OnInit, HostListener } from '@angular/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {

  amount = 500;
  handler: any;

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
              private serv: BookingService) { }

  ngOnInit(): void {

    this.stripeTest = this.fb.group({
      name: ['' , Validators.required]
    });
    this.bookingInfo = JSON.parse(localStorage.getItem('itinerary'));
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

  handlePayment() {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, {})
      .subscribe(result => {
        if (result) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result);
          /*
          this.serv.SaveBooking(result.token).subscribe(data => {
            console.log(data);
          });*/
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
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
