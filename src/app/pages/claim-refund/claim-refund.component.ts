import { Component, OnInit, HostListener } from '@angular/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';

@Component({
  selector: 'app-claim-refund',
  templateUrl: './claim-refund.component.html',
  styleUrls: ['./claim-refund.component.scss']
})
export class ClaimRefundComponent implements OnInit {


  amount = 500;
  handler: any;

  elements: Elements;
  card: StripeElement;

  stripeTest: FormGroup;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  bsModalRef: BsModalRef;
  @HostListener('window:popstate' , ['$event'])
  onpopstate(event) {
    this.handler.close();
  }

  constructor(private fb: FormBuilder, private stripeService: StripeService,
              private snack: MatSnackBar, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {

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

  Success() {
    const done = this.snack.open('You have entered invalid payment details', 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    done.afterDismissed().subscribe(res => {
      const ref = this.modalService.show(GlobalConfirmComponent, {
        initialState: {
          data: {
            message: 'Booking Cancelled Successfully'
          }
        }
      });
    });
  }
}
