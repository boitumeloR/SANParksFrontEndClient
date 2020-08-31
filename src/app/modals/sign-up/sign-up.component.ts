import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from '../add-booking/add-booking.component';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AuthService, SignUpAuth, SMSResult, CountryDropdown } from 'src/app/services/Auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpComponent implements OnInit {
  // Country
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.SouthAfrica];

  // Form Groups
  authGroup: FormGroup;
  numGroup: FormGroup;
  verifyGroup: FormGroup;
  clientGroup: FormGroup;
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
  loader2 = false;
  collapseDiv = true;
  userID: number;
  clientID: number;
  // Observables
  signUpAuth$: Observable<SignUpAuth>;
  sendSMS$: Observable<SMSResult>;
  verifyOTP$: Observable<any>;
  clientSave$: Observable<any>;

  // Dropdown
  countries: CountryDropdown[];
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
      number: ['', Validators.compose([Validators.required, Validators.maxLength(15)])]
    });

    this.verifyGroup = this.formBuilder.group({
      code: ['', Validators.required]
    });

    this.clientGroup = this.formBuilder.group({
      title: ['', Validators.required],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      surname: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      id: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      countryId: ['', Validators.required],
      address1: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      post: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      age: ['', Validators.required]
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
        if (!res.Error) {
          this.userID = res.UserID;
          this.loader = false;
          stepper.next();
        } else {
          console.log(res.Message, 'here');
          this.httpMessage = res.Message;
          this.httpError = true;
          this.loader = false;
        }
      }, (error: HttpErrorResponse) => {
        this.httpMessage = `An unknown error occured on our servers: ${error.message}`;
        this.httpError = true;
        this.loader = false;
      });
    } else if (this.authGroup.get('email').value !== this.authGroup.get('confirmPassword').value) {
      this.firstError = 'Make sure your password matches in both fields';
    }
  }

  sendSMS(): void {
    if (this.numGroup.valid) {
      this.loader = true;
      const numObj = this.numGroup.get('number').value;
      const userDetails = {
        // tslint:disable-next-line: radix
        UserID: this.userID,
        PhoneNumber: numObj.e164Number
      };
      console.log(userDetails);

      this.sendSMS$ =  this.serv.SendSMS(userDetails, this.global.GetServer());
      this.sendSMS$.subscribe((res) => {
        if (!res.Error) {
          this.collapseDiv = !this.collapseDiv;
          this.clientID = res.ClientID;
          this.loader = false;
        } else {
          this.httpError = true;
          this.httpMessage = `An error occured: ${res.Message}. Try again. ` ;
          this.loader = false;
        }
      }, (error: HttpErrorResponse) => {
        this.httpError = true;
        this.httpMessage = error.message;
        this.loader = false;
      });
    }
  }

  verifySMS(stepper: MatStepper): void {
    if (this.verifyGroup.valid) {
      this.loader2 = true;

      const otpData = {
        OTP: this.verifyGroup.get('code').value,
        ClientID: this.clientID,
        UserID: this.userID
      };

      console.log(otpData);

      this.verifyOTP$ = this.serv.VerifySMS(otpData, this.global.GetServer());
      this.verifyOTP$.subscribe(res => {
        if (!res.Error) {
          this.countries = res.Countries;
          stepper.next();
          this.loader2 = false;
        } else {
          this.httpError = true;
          this.httpMessage = res.Message;
          this.loader2 = false;
        }
      }, (error: HttpErrorResponse) => {
        this.httpError = true;
        this.httpMessage = error.message;
        this.loader2 = false;
      });
    }
  }

  SignUpClient() {
    this.loader2 = true;
    if (this.clientGroup.valid) {
      const clientObj = {
        UserID: this.userID,
        ClientID: this.clientID,
        CountryID: this.clientGroup.get('countryId').value,
        ClientName: this.clientGroup.get('name').value,
        ClientSurname: this.clientGroup.get('surname').value,
        ClientIDCode: this.clientGroup.get('id').value,
        ClientTitle: this.clientGroup.get('title').value,
        Address1: this.clientGroup.get('address1').value,
        Address2: this.clientGroup.get('address1').value,
        PostalCode: this.clientGroup.get('post').value,
        Age: this.clientGroup.get('age').value,
      };

      this.clientSave$ = this.serv.SaveClient(clientObj, this.global.GetServer());

      this.clientSave$.subscribe(res => {
        if (!res.Error) {
          this.loader2 = false;
          this.close();

          this.snack.open('You have successfully registered. You may proceed to making your booking', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        } else {
          this.httpError = true;
          this.httpMessage = res.Message;
          this.loader2 = false;
        }
      }, (error: HttpErrorResponse) => {
        this.httpError = true;
        this.httpMessage = error.message;
        this.loader2 = false;
      });
    } else {
      this.httpError = true;
      this.loader2 = false;
      this.httpMessage = 'Please enter all details properly!!';
    }
  }

  resetHttp() {
    this.httpError = false;
    this.httpMessage = '';
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
