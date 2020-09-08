import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

@Component({
  selector: 'app-pay-wildcard',
  templateUrl: './pay-wildcard.component.html',
  styleUrls: ['./pay-wildcard.component.scss']
})
export class PayWildcardComponent implements OnInit {

  amount = 500;
  handler: any;

  elements: Elements;
  card: StripeElement;

  stripeTest: FormGroup;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  @HostListener('window:popstate' , ['$event'])
  onpopstate(event) {
    this.handler.close();
  }
  constructor(private fb: FormBuilder, private stripeService: StripeService) { }

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
}
