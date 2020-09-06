import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ViewAvailableImgComponent } from 'src/app/modals/view-available-img/view-available-img.component';
import { RemoveGuestConfirmComponent } from 'src/app/modals/remove-guest-confirm/remove-guest-confirm.component';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';
import { AddGuestComponent } from 'src/app/modals/add-guest/add-guest.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { Booking, BookingService, Guest } from 'src/app/services/booking/booking.service';
import { element } from 'protractor';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  payPerc = 0.3;
  totalDue =  100;
  payAmount = 0.3 * this.totalDue;
  bsModalRef: BsModalRef;
  bookingData: Booking;
  conservationCheck = 0;
  laterChecked = false;
  upfrontChecked = false;
  WCChecked = false;
  fullConservationAmount = 0;
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder,
              private serv: BookingService, private global: GlobalService) { }

  ngOnInit(): void {
    this.bookingData = JSON.parse(localStorage.getItem('itinerary'));

    this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
    /*
    this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
    this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
    */
    // map BaseRates
    this.bookingData.AccommodationBookings.map((el) => {
      this.serv.getItineraryAccommodationData(this.global.GetServer(), el).subscribe(res => {
        el.BaseRate = res;
      });
    });

    console.log(this.bookingData.AccommodationBookings);
    this.payAmount = 1;
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  openImageModal() {
    console.log('hello');

    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you want to remove this booking instance?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  getAllGuests(): Guest[] {
    const accommodationGuests: Guest[] = [];
    this.bookingData.AccommodationBookings.forEach(acc => {
      acc.Guests.forEach(guest => accommodationGuests.push(guest));
    });

    const activityGuests: Guest[] = [];
    this.bookingData.ActivityBookings.forEach(act => {
      act.Guests.forEach(guest => activityGuests.push(guest));
    });

    const dayGuests: Guest[] = [];
    this.bookingData.DayVisits.forEach(day => {
      day.Guests.forEach(guest => dayGuests.push(guest));
    });

    const allGuests: Guest[]  = [].concat(accommodationGuests, activityGuests, dayGuests);
    return allGuests;
  }

  changeWC() {
    if (this.conservationCheck === 0 ) {
      // confirm wildard
    }
  }

  changeLater() {
    if (this.conservationCheck === 0 ) {
      // confirm wildard
    }
  }

  changeUpfront() {
    const guests = this.getAllGuests();

    this.serv.getConservationFees(guests, this.global.GetServer()).subscribe(res => {
      this.fullConservationAmount = res.Amount;
      this.totalDue += this.fullConservationAmount;
    });
  }
  confirmRemoveGuest() {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Are you sure you want to remove this guest?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  ConfirmWild() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Unsuccessful Payment Transaction'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  changePaymentAmount() {
    this.payAmount = this.payPerc * 1100;
    console.log(this.payAmount);
  }

  addGuestModal() {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddGuestComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
