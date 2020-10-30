import { Component, OnInit, HostListener } from '@angular/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-last-payment',
  templateUrl: './last-payment.component.html',
  styleUrls: ['./last-payment.component.scss']
})
export class LastPaymentComponent implements OnInit {
  amount = 500;
  handler: any;

  loader: boolean;
  elements: Elements;
  card: StripeElement;

  bookingInfo: Booking;
  bookingID: number;
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
              private serv: BookingService, private global: GlobalService,
              private title: Title) { }

  ngOnInit(): void {

    const bookObj = JSON.parse(localStorage.getItem('lastPayment'));

    this.amount = bookObj.PaymentAmount;
    this.bookingID = bookObj.BookingID;

    this.title.setTitle('Pay-Off Booking');
    this.loader = false;
    this.stripeTest = this.fb.group({
      name: ['' , Validators.required]
    });
    this.bookingInfo = JSON.parse(localStorage.getItem('itinerary'));
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
          console.log(result.token.id);
          this.bookingInfo = JSON.parse(localStorage.getItem('itinerary'));
          const sess = JSON.parse(sessionStorage.getItem('session'));

          const payableBooking: Booking = {
            ClientID: null,
            BookingID: this.bookingID,
            ConservationAmount: null,
            PaymentAmount: this.amount,
            TotalAmount: this.amount,
            EmployeeID: null,
            paymentToken: result.token.id,
            PaidConservationFee: false,
            AccommodationBookings: [],
            ActivityBookings: [],
            DayVisits: [],
            Session: sess
          };
          localStorage.setItem('itinerary', JSON.stringify(this.bookingInfo));
          this.serv.PayPayableBoooking(payableBooking , this.global.GetServer()).subscribe(data => {
            if (data.Success) {
              this.loader = false;
              console.log('Success!!');
              sessionStorage.setItem('session', JSON.stringify(data.Session));
              this.snack.open('You have successfully paid for your booking', 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
              });
              this.router.navigateByUrl('myBookings');
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
