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
import { LoginModalComponent } from 'src/app/modals/login-modal/login-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
  laterChecked = null;
  upfrontChecked = null;
  WCChecked = null;
  fullConservationAmount = 0;
  loginRef: BsModalRef;
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder,
              private serv: BookingService, private global: GlobalService,
              private snack: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.bookingData = JSON.parse(localStorage.getItem('itinerary'));
    // map BaseRates
    if (this.bookingData) {
      this.bookingData.AccommodationBookings.map((el) => {
        this.serv.getItineraryAccommodationData(this.global.GetServer(), el).subscribe(res => {
          el.BaseRate = res;
        });
      });

      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      /*
      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      */

      this.payAmount = this.payPerc * this.totalDue;
    }
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  initialiseAmounts(): void {
    this.bookingData = JSON.parse(localStorage.getItem('itinerary'));
    // map BaseRates
    if (this.bookingData) {
      this.bookingData.AccommodationBookings.map((el) => {
        this.serv.getItineraryAccommodationData(this.global.GetServer(), el).subscribe(res => {
          el.BaseRate = res;
        });
      });

      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      /*
      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      this.totalDue += this.bookingData.AccommodationBookings.map(zz => zz.BaseRate).reduce((index, accum) => index + accum);
      */

      this.payAmount = this.payPerc * this.totalDue;
    }
    console.log(this.bookingData.AccommodationBookings);
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

  LoginModal() {
    this.loginRef = this.modalService.show(LoginModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          data: {
          message: 'Are you sure you want to remove this guest?'
          }
        }
      });
    this.loginRef.content.closeBtnName = 'Close';
    this.loginRef.content.event.subscribe(res => {
      if (res.result === true) {
        const session = JSON.parse(sessionStorage.getItem('session'));
        this.serv.WildcardExists(this.global.GetServer(), session).subscribe(result => {
          if (result.Exists === true) {
            this.snack.open('You will be exempt from paying any conservation fees for this booking.', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });

            sessionStorage.setItem('session', JSON.stringify(result.Session));
          } else {
            this.WCChecked = null;
            const snacker = this.snack.open('You do not have a valid wildcard, choose another option', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });

            sessionStorage.setItem('session', JSON.stringify(result.Session));
            snacker.afterDismissed().subscribe(() => {
              location.reload();
            });
          }
        });
      }
    });
  }
  changeWC() {
    const session = JSON.parse(sessionStorage.getItem('session'));

    if (!session) {
      this.LoginModal();
    } else {
      this.serv.WildcardExists(this.global.GetServer(), session).subscribe(result => {
        if (result.Session.Error) {
          const snacker = this.snack.open(result.Session.Error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });

          snacker.afterDismissed().subscribe(() => {
            this.router.navigateByUrl('Login');
          });
        } else {
          sessionStorage.setItem('session', JSON.stringify(result.Session));
        }

        if (result.Exists === true) {
          this.snack.open('You will be exempt from paying any conservation fees for this booking.', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        } else {
          this.WCChecked = null;
          const snacker = this.snack.open('You do not have a valid wildcard, choose another option', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });

          snacker.afterDismissed().subscribe(() => {
            location.reload();
          });
        }
      }, (error: HttpErrorResponse) => {
        this.snack.open(error.message, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
      });
    }
  }

  changeLater() {
    if (this.fullConservationAmount > 0 ) {
      this.totalDue -= this.fullConservationAmount;
      this.fullConservationAmount = 0;
    }

    const guests = this.getAllGuests();
    this.serv.getConservationFees(guests, this.global.GetServer()).subscribe(res => {
      this.fullConservationAmount = res.Amount;
      this.bookingData.ConservationAmount = this.fullConservationAmount;

      localStorage.setItem('itinerary', JSON.stringify(this.bookingData));
      this.initialiseAmounts();
      console.log('amounts');
      console.log(this.fullConservationAmount);
    });
  }

  changeUpfront() {
    const guests = this.getAllGuests();
    if (this.fullConservationAmount > 0 ) {
      this.fullConservationAmount = 0;
    }
    this.serv.getConservationFees(guests, this.global.GetServer()).subscribe(res => {
      this.fullConservationAmount = res.Amount;
      this.totalDue += this.fullConservationAmount;
      this.bookingData.ConservationAmount = this.fullConservationAmount;

      localStorage.setItem('itinerary', JSON.stringify(this.bookingData));
      this.initialiseAmounts();
      console.log('amounts');
      console.log(this.fullConservationAmount);
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
  dummy() {
    const session = JSON.parse(sessionStorage.getItem('session'));
    this.serv.dummy(this.global.GetServer(), session).subscribe(res => {
      console.log(res);
      sessionStorage.setItem('session', JSON.stringify(res.Session));
    });
  }

  CancelAll() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Are you sure you want to cancel all your reservations?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        localStorage.removeItem('itinerary');
        location.reload();
      }
    });
  }

  RemoveAccommodationBooking(booking) {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Are you sure you want to cancel this reservation?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const index = this.bookingData.AccommodationBookings.indexOf(booking);
        this.bookingData.AccommodationBookings.splice(index, 1);
        localStorage.setItem('itinerary', JSON.stringify(this.bookingData));

        if (
          this.bookingData.AccommodationBookings.length === 0 &&
          this.bookingData.ActivityBookings.length === 0 &&
          this.bookingData.DayVisits.length === 0
        ) {
          localStorage.removeItem('itinerary');
        }
        this.initialiseAmounts();
      }
    });
  }

  RemoveAccommodationGuest(acc, guest) {
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

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const indexGuest = this.bookingData.AccommodationBookings.find(z => z === acc).Guests.indexOf(guest);
        if (this.bookingData.AccommodationBookings.find(z => z === acc).Guests.length > 2) {
          this.bookingData.AccommodationBookings.find(z => z === acc).Guests.splice(indexGuest, 1);
          localStorage.setItem('itinerary', JSON.stringify(this.bookingData));

          this.initialiseAmounts();
        } else {
          this.snack.open('You have the minimum amount of guests for this reservation', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      }
    });
  }

  RemoveActivityBooking(booking) {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Are you sure you want to cancel this reservation?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const index = this.bookingData.ActivityBookings.indexOf(booking);
        this.bookingData.ActivityBookings.splice(index, 1);
        localStorage.setItem('itinerary', JSON.stringify(this.bookingData));

        if (
          this.bookingData.AccommodationBookings.length === 0 &&
          this.bookingData.ActivityBookings.length === 0 &&
          this.bookingData.DayVisits.length === 0
        ) {
          localStorage.removeItem('itinerary');
        }
        this.initialiseAmounts();
      }
    });
  }

  RemoveActivityGuest(acc, guest) {
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

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const indexGuest = this.bookingData.ActivityBookings.find(z => z === acc).Guests.indexOf(guest);
        if (this.bookingData.ActivityBookings.find(z => z === acc).Guests.length > 2) {
          this.bookingData.ActivityBookings.find(z => z === acc).Guests.splice(indexGuest, 1);
          localStorage.setItem('itinerary', JSON.stringify(this.bookingData));

          this.initialiseAmounts();
        } else {
          this.snack.open('You have the minimum amount of guests for this reservation', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      }
    });
  }

  RemoveDayVisits(booking) {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
          message: 'Are you sure you want to cancel this reservation?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const index = this.bookingData.DayVisits.indexOf(booking);
        this.bookingData.DayVisits.splice(index, 1);
        localStorage.setItem('itinerary', JSON.stringify(this.bookingData));
        if (
          this.bookingData.AccommodationBookings.length === 0 &&
          this.bookingData.ActivityBookings.length === 0 &&
          this.bookingData.DayVisits.length === 0
        ) {
          localStorage.removeItem('itinerary');
        }

        this.initialiseAmounts();
      }
    });
  }

  RemoveDayVisitGuest(acc, guest) {
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

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        const indexGuest = this.bookingData.DayVisits.find(zz => zz === acc).Guests.indexOf(guest);
        if (this.bookingData.DayVisits.find(z => z === acc).Guests.length > 2) {
          this.bookingData.DayVisits.find(z => z === acc).Guests.splice(indexGuest, 1);
          localStorage.setItem('itinerary', JSON.stringify(this.bookingData));

          this.initialiseAmounts();
        } else {
          this.snack.open('You have the minimum amount of guests for this reservation', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      }
    });
  }

  Checkout() {
    if (this.laterChecked == null &&
       this.upfrontChecked == null &&
       this.WCChecked == null
       ) {
        this.snack.open('Check one of the radio buttons for your conservation fee option.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
    } else {
      this.bookingData = JSON.parse(localStorage.getItem('itinerary'));
      console.log(this.totalDue);
      if (this.bookingData) {
        this.bookingData.ConservationAmount = this.fullConservationAmount;
        this.bookingData.PaymentAmount = this.totalDue * this.payPerc;
        this.bookingData.TotalAmount = this.totalDue;
        console.log(this.totalDue);
        localStorage.setItem('itinerary', JSON.stringify(this.bookingData));
      }
      this.router.navigate(['bookingPayment']);
    }
  }
}
