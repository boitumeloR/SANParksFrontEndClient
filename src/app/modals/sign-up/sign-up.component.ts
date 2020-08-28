import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from '../add-booking/add-booking.component';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpComponent implements OnInit {
  //
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  //
  authGroup: FormGroup;
  numGroup: FormGroup;
  quantity = 1;
  guests = 1;
  adultGuests = 1;
  totalGuests = 2;
  enterGuest = true;
  config = {
    animated: true,
    backdrop: 'static'
  };
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  firstError = 'Enter all fields correctly & make sure your password matches in both fields';
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder, private modalService: BsModalService) { }


  ngOnInit(): void {
    this.authGroup = this.formBuilder.group({
      email: ['', Validators.compose(
        [Validators.email, Validators.required, Validators.maxLength(50)]
        )],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.numGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }


  goToPhone(stepper: MatStepper): void {
    if (this.authGroup.valid) {
      stepper.next();
    } else if (this.authGroup.get('email').value !== this.authGroup.get('confirmPassword').value) {
      this.firstError = 'Make sure your password matches in both fields';
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  confirm() {
    // do stuff
    this.close();
  }
  close() {
    this.bsModalRef.hide();
  }
  toggleGuest() {
    this.enterGuest = !this.enterGuest;
  }
  addGuest() {
    this.guests++;
    this.totalGuests++;
  }
  subtractGuest() {
    this.guests--;
    this.totalGuests--;
  }

  addAdultGuest() {
    this.adultGuests++;
    this.totalGuests++;

  }
  subtractAdultGuest() {
    this.adultGuests--;
    this.totalGuests--;
  }

  addQuantity() {
    this.quantity++;
  }
  subtractQuantity() {
    this.quantity--;
  }
}
