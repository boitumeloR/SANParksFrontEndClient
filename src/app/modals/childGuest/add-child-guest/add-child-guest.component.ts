import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-add-child-guest',
  templateUrl: './add-child-guest.component.html',
  styleUrls: ['./add-child-guest.component.scss']
})
export class AddChildGuestComponent implements OnInit {

  countries: any;
  guestInfo: FormGroup;
  httpError = false;
  httpMessage = '';
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
      GuestAge: [null, Validators.compose([Validators.required, Validators.max(12), Validators.min(1)])],
      GuestIDCode: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
    });
  }

  confirm() {
    // do stuff
    if (this.guestInfo.valid) {
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
