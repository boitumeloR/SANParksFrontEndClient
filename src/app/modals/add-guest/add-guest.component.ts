import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';


@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {

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
      CountryID: [1, Validators.required],
      GuestName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      GuestSurname: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      GuestAge: [null, Validators.compose([Validators.required, Validators.max(100)])],
      GuestIDCode: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
    });
  }

  changeCountry(): void {
    console.log(this.guestInfo.value);
    if (this.guestInfo.get('CountryID').value === '1') {
      this.idLabelName = 'Identity Number';
    } else {
      this.idLabelName = 'Passport Number';
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
    if (Number(day) <= 31 && Number(month) <= 12 && year < new Date().getFullYear().toString()) {
      return true;
    } else {
      return false;
    }
  }
  confirm() {
    // do stuff
    if (this.guestInfo.valid) {
      if (this.guestInfo.get('CountryID').value === 1) {
        const code: string = this.guestInfo.get('GuestIDCode').value;
        console.log(this.validateGuestDOB(this.guestInfo.get('GuestIDCode').value));
        if (code.length === 13 && this.validateGuestDOB(this.guestInfo.get('GuestIDCode').value)) {
          console.log(this.guestInfo.value);
          this.snack.open('Successfuly added Guest', 'Okay', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 500
          });

          this.event.emit(this.guestInfo.value);
          this.close();

        } else {
          this.httpError = true;
          this.httpMessage = 'Enter an appropriate ID number.';
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
