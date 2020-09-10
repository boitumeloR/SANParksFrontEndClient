import { Component, OnInit } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SignUpAuth, SMSResult, CountryDropdown, AuthService } from 'src/app/services/Auth/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  // Country
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.SouthAfrica];

  // Form Groups

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

  clientInfo: any;
  // Dropdown
  countries: CountryDropdown[];
  titles: any;
  selectedTitle: number;
  firstError = 'Enter all fields correctly & make sure your password matches in both fields';
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder,
              private modalService: BsModalService, private serv: AuthService,
              private global: GlobalService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.clientInfo);
    this.clientGroup = this.formBuilder.group({
      name: [this.clientInfo.ClientName, Validators.compose([Validators.required, Validators.maxLength(50)])],
      surname: [this.clientInfo.ClientSurname, Validators.compose([Validators.required, Validators.maxLength(50)])],
      id: [this.clientInfo.ClientIDCode, Validators.compose([Validators.required, Validators.maxLength(50)])],
      address1: [this.clientInfo.AddressLine1, Validators.compose([Validators.required, Validators.maxLength(50)])],
      address2: [this.clientInfo.AddressLine2, Validators.compose([Validators.required, Validators.maxLength(50)])],
      post: [this.clientInfo.PostalCode, Validators.compose([Validators.required, Validators.maxLength(10)])],
    });
  }


  Update() {
    this.loader2 = true;
    if (this.clientGroup.valid) {
      const clientObj = {
        ClientName: this.clientGroup.get('name').value,
        ClientSurname: this.clientGroup.get('surname').value,
        ClientIDCode: this.clientGroup.get('id').value,
        Address1: this.clientGroup.get('address1').value,
        Address2: this.clientGroup.get('address1').value,
        PostalCode: this.clientGroup.get('post').value,
        Session: JSON.parse(sessionStorage.getItem('session'))
      };

      this.serv.UpdateClient(this.global.GetServer(), clientObj).subscribe(res => {
        if (res.Success) {
          this.loader2 = false;
          this.bsModalRef.hide();

          this.snack.open('You have successfully updated', 'OK', {
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
}
