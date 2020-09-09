import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WildcardService, Wildcard } from 'src/app/services/Wildcard/wildcard.service';

@Component({
  selector: 'app-pay-wildcard',
  templateUrl: './pay-wildcard.component.html',
  styleUrls: ['./pay-wildcard.component.scss']
})
export class PayWildcardComponent implements OnInit {

  amount: any;
  handler: any;

  elements: Elements;
  card: StripeElement;
  loader: boolean;

  toUpdate = false;
  wildcardInfo: Wildcard;
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
              private serv: WildcardService, private global: GlobalService) { }

  ngOnInit(): void {
    this.loader = false;
    const wc: Wildcard = JSON.parse(localStorage.getItem('wildcard'));
    const update: boolean = JSON.parse(localStorage.getItem('update'));
    if (wc) {
      this.amount = wc.Amount;
    }

    if (update) {
      this.toUpdate = true;
    }
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
    this.loader = true;
    this.stripeService
    .createToken(this.card, {})
    .subscribe(result => {
      if (result) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        this.wildcardInfo = JSON.parse(localStorage.getItem('wildcard'));
        this.wildcardInfo.paymentToken = result.token.id;
        console.log(this.wildcardInfo.paymentToken);
        const sess = JSON.parse(sessionStorage.getItem('session'));
        this.wildcardInfo.Session = sess;
        localStorage.setItem('wildcard', JSON.stringify(this.wildcardInfo));
        this.serv.SaveWildcard(this.wildcardInfo , this.global.GetServer()).subscribe(data => {
          if (data.Success) {
            this.loader = false;
            console.log('Success!!');
            sessionStorage.setItem('session', JSON.stringify(data.Session));
            this.snack.open('You have successfully purchased a wildcard for a year', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });
            localStorage.removeItem('wildcard');
            this.router.navigateByUrl('');
          } else {
            if (data.Session.Error) {
              this.loader = false;
              const login = this.snack.open(data.Session.Error, 'Okay', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });

              login.afterDismissed().subscribe(() => this.router.navigateByUrl('Login'));
            } else {
              this.loader = false;
              this.openSnack(data.Message);
            }
          }
        }, (error: HttpErrorResponse) => {
          this.openSnack(error.message);
        });
      }
    });
  }

  handleUpdate() {
    this.loader = true;
    this.stripeService
    .createToken(this.card, {})
    .subscribe(result => {
      if (result) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        this.wildcardInfo = JSON.parse(localStorage.getItem('wildcard'));
        this.wildcardInfo.paymentToken = result.token.id;
        console.log(this.wildcardInfo.paymentToken);
        const sess = JSON.parse(sessionStorage.getItem('session'));
        this.wildcardInfo.Session = sess;
        localStorage.setItem('wildcard', JSON.stringify(this.wildcardInfo));
        this.serv.RenewWildcard(this.wildcardInfo , this.global.GetServer()).subscribe(data => {
          if (data.Success) {
            this.loader = false;
            console.log('Success!!');
            sessionStorage.setItem('session', JSON.stringify(data.Session));
            this.snack.open('You have successfully purchased a wildcard for a year', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });
            localStorage.removeItem('wildcard');
            localStorage.removeItem('update');
            this.router.navigateByUrl('');
          } else {
            if (data.Session.Error) {
              this.loader = false;
              const login = this.snack.open(data.Session.Error, 'Okay', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });

              login.afterDismissed().subscribe(() => this.router.navigateByUrl('Login'));
            } else {
              this.loader = false;
              this.openSnack(data.Message);
            }
          }
        }, (error: HttpErrorResponse) => {
          this.openSnack(error.message);
        });
      }
    });
  }

  openSnack(message: string) {
    this.snack.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
