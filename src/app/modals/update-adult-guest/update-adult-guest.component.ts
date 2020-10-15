import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from 'src/app/services/Auth/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-update-adult-guest',
  templateUrl: './update-adult-guest.component.html',
  styleUrls: ['./update-adult-guest.component.scss']
})
export class UpdateAdultGuestComponent implements OnInit {

  initialData: any;
  calcAge: number;
  countries: any;
  guestInfo: FormGroup;
  httpError = false;
  httpMessage = '';
  idLabelName = 'Identity Number';
  public event: EventEmitter<any> = new EventEmitter<any>();
  constructor(private bsModalRef: BsModalRef, private snack: MatSnackBar,
              private formBuilder: FormBuilder, private countryServ: AuthService,
              private global: GlobalService) { }

  ngOnInit(): void {

    this.countryServ.GetCountries(this.global.GetServer()).subscribe(res => {
      this.countries = res;
    });
    this.guestInfo = this.formBuilder.group({
      CountryID: [this.initialData.CountryID, Validators.required],
      GuestName: [this.initialData.GuestName, Validators.compose([Validators.required, Validators.maxLength(50)])],
      GuestSurname: [this.initialData.GuestSurname, Validators.compose([Validators.required, Validators.maxLength(50)])],
      GuestAge: [this.initialData.GuestAge, Validators.compose([Validators.required, Validators.min(13), Validators.max(100)])],
      GuestIDCode: [this.initialData.GuestIDCode, Validators.compose([Validators.maxLength(20), Validators.required])]
    });

    if (this.guestInfo.get('CountryID').value === '1' || this.guestInfo.get('CountryID').value === 1) {
      this.guestInfo.get('GuestAge').disable();
    }
  }

  changeCountry(): void {
    console.log(this.guestInfo.value);
    if (this.guestInfo.get('CountryID').value === 1 || this.guestInfo.get('CountryID').value === '1') {
      this.idLabelName = 'Identity Number';
      this.guestInfo.get('GuestAge').disable();
    } else {
      this.idLabelName = 'Passport Number';
      this.guestInfo.get('GuestAge').enable();
    }
  }

  validateGuestDOB(ID: string): boolean {
    let year = '';
    if (Number(ID.substring(0, 2)) < 10) {
      year = `20${ID.substring(0, 2)}`;
    } else {
      year = `19${ID.substring(0, 2)}`;
    }

    const month = ID.substring(2, 4);
    const day = ID.substring(4, 6);

    if (Number(day) <= 31 && Number(month) <= 12 && Number(year) < new Date().getFullYear()) {
      if (this.calculateAge(Number(year), Number(month), Number(day))) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  calculateAge(year: number, month: number, day: number): boolean {
    this.calcAge = 0;
    const today = new Date();

    this.calcAge = today.getFullYear() - year;
    this.calcAge --;
    if (today.getMonth() > month) {
      this.calcAge++;
    } else if (today.getMonth() === month) {
      if (today.getDay() >= day) {
        this.calcAge++;
      }
    }

    this.guestInfo.get('GuestAge').enable();
    this.guestInfo.get('GuestAge').setValue(this.calcAge);
    if (this.guestInfo.get('GuestAge').valid) {
      return true;
    } else  {
      this.guestInfo.get('GuestAge').disable();
      return false;
    }
  }


  confirm() {
    // do stuff
    if (this.guestInfo.valid) {
      if (this.guestInfo.get('CountryID').value === 1 || this.guestInfo.get('CountryID').value === '1') {
        const code: string = this.guestInfo.get('GuestIDCode').value;
        if (code.length === 13 && this.validateGuestDOB(this.guestInfo.get('GuestIDCode').value)) {
          console.log(this.guestInfo.value);

          this.event.emit(this.guestInfo.value);
          this.close();

        } else {
          this.httpError = true;
          this.httpMessage = 'Enter an appropriate ID number, for ages between 13 and 100';
        }
      } else {
        // Carry on, not south african.
        console.log(this.guestInfo.value);
        this.snack.open('Successfuly added Guest', 'Okay', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 500
        });

        this.event.emit(this.guestInfo.value);
        this.close();
      }
    } else {
      this.httpError = true;
      this.httpMessage = 'Enter information in the correct format.';
    }
  }

  resetHttp() {
    this.httpError = false;
    this.httpMessage = '';
  }

  close() {
    this.bsModalRef.hide();
  }

}
