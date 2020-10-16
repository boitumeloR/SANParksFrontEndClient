import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginModalComponent } from 'src/app/modals/login-modal/login-modal.component';

@Component({
  selector: 'app-external-booking-payment',
  templateUrl: './external-booking-payment.component.html',
  styleUrls: ['./external-booking-payment.component.scss']
})
export class ExternalBookingPaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  amount = 0;
  handler: any;
  observe$: any;

  verified = false;
  bookingID: number;
  loader: boolean;
  elements: Elements;
  card: StripeElement;

  loginRef: BsModalRef;
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
              private serv: BookingService, private global: GlobalService,
              private route: ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit(): void {

    this.observe$ = this.route.params.subscribe(parameter => {
      // tslint:disable-next-line: no-string-literal
      this.bookingID = +parameter['id'];
    });

    this.loader = false;
    this.stripeTest = this.fb.group({
      name: ['' , Validators.required]
    });


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

  ngAfterViewInit() {
    const sess =  JSON.parse(sessionStorage.getItem('session'));

    if (sess) {
      // Do something
    } else {
      this.LoginModal();
    }
  }

  LoginModal() {
    this.loginRef = this.modalService.show(LoginModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          data: {
          message: 'Are you sure you want to remove this guest?'
          }
        }
      });
    this.loginRef.content.closeBtnName = 'Close';
    this.loginRef.content.event.subscribe(res => {
      if (res.result === true) {
        const session = JSON.parse(sessionStorage.getItem('session'));

        const bookingVerify = {
          BookingID: this.bookingID,
          SessionID: session
        };

        this.serv.VerifyPayment(bookingVerify, this.global.GetServer()).subscribe(result => {
          if (result.Session) {
            if (result.Late) {
              this.snack.open('Your payment period has expired and your booking has been cancelled', 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });

              this.router.navigateByUrl('');
            } else {
              if (result.Verified) {
                this.verified = true;
                this.amount = result.Amount;
                sessionStorage.setItem('session', JSON.stringify(result.Session));
              } else {
                this.snack.open('This booking does not seem to belong you.', 'OK', {
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                });
                sessionStorage.removeItem('session');
                this.router.navigateByUrl('');
              }
            }
          } else {
            sessionStorage.removeIteme('session');
            this.router.navigateByUrl('');
          }
        });
      } else {
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnDestroy() {
    this.observe$.unsubscribe();
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
      sessionStorage.setItem('session', JSON.stringify(res.Session));
    }, (error: HttpErrorResponse) => this.openSnack(error.message));
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
          this.bookingInfo.PaymentAmount = this.amount;
          this.bookingInfo.BookingID = this.bookingID;
          console.log(this.bookingInfo.paymentToken);
          const sess = JSON.parse(sessionStorage.getItem('session'));
          this.bookingInfo.Session = sess;
          localStorage.setItem('itinerary', JSON.stringify(this.bookingInfo));
          this.serv.PayOutstanding(this.bookingInfo , this.global.GetServer()).subscribe(data => {
            if (data.Success) {
              this.loader = false;
              sessionStorage.setItem('session', JSON.stringify(data.Session));
              this.snack.open('You have successfully paid for your booking', 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
              });
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
