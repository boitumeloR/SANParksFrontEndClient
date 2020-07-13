import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit{

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
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
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
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
