import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from '../add-booking/add-booking.component';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  // Error
  httpError = false;
  httpMessage = '';
  // Loader
  loader = false;
  userID: number;
  // Observables
  signUpAuth$: Observable<number>;
  firstError = 'Enter all fields correctly & make sure your password matches in both fields';
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder,
              private modalService: BsModalService, private serv: AuthService,
              private global: GlobalService, private snack: MatSnackBar) { }


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
      this.loader = true;
      const signUpAuth = {
        Email: this.authGroup.get('email').value,
        Password: this.authGroup.get('password').value
      };
      this.signUpAuth$ =  this.serv.SignUpAuth(signUpAuth, this.global.GetServer());
      this.signUpAuth$.subscribe((res) => {
        this.userID = res;
        stepper.next();
        this.loader = false;
      }, (error: HttpErrorResponse) => {
        this.httpMessage = `An unknown error occured on our servers: ${error.message}`;
        this.httpError = true;
        this.loader = false;
      });
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
