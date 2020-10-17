import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { AccommodationBooking, Booking } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { AddChildGuestComponent } from '../childGuest/add-child-guest/add-child-guest.component';
import { GlobalConfirmComponent } from '../global-confirm/global-confirm.component';
import { UpdateAdultGuestComponent } from '../update-adult-guest/update-adult-guest.component';
import { UpdateChildGuestComponent } from '../update-child-guest/update-child-guest.component';

@Component({
  selector: 'app-update-accommodation-booking',
  templateUrl: './update-accommodation-booking.component.html',
  styleUrls: ['./update-accommodation-booking.component.scss']
})
export class UpdateAccommodationBookingComponent implements OnInit {


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
    initialData: any;
    availability: any[];
    accommodationType: any;
    currentBooking: any;
    initialDate: Date[];
    bsValue = new Date();
    bsRangeValue: Date[];
    maxDate: Date;
    minDate: Date;
    bookingGuests: any[] = [];
    httpError = false;
    httpMessage = '';

    loader = false;
    addModalRef: BsModalRef;

    constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder, private service: BsModalService,
                private serv: AvailabilityService, private global: GlobalService, private router: Router) {
      const Dates = JSON.parse(localStorage.getItem('Dates'));
      this.minDate = this.parseDate(Dates[0].Date);
      this.maxDate = this.parseDate(Dates[Dates.length - 1].Date);
     }

    ngOnInit(): void {
      console.log(this.initialData);

      this.currentBooking = this.initialData.CurrentBooking;
      this.accommodationType = this.initialData.AvailableResults.AccommodationTypes[0];
      this.availability = this.accommodationType.Availability;
      const Dates = JSON.parse(localStorage.getItem('Dates'));
      this.bsRangeValue = Dates.map(zz => zz.Date);
      this.bsRangeValue = this.bsRangeValue.map(zz => this.parseDate(zz));
      console.log(this.minDate, this.maxDate);
      this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this.formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }

    parseDate(input) {
      const parts = input.match(/(\d+)/g);
      // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
      return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
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

    ChangeAvailabilityDates() {
      const filtered = this.availability
        .filter(zz => new Date(zz.Date) >= this.bsRangeValue[0] &&
        new Date(zz.Date) <= this.bsRangeValue[this.bsRangeValue.length - 1]);
      // Update the limits
    }

    addGuest() {
      if (this.totalGuests < this.accommodationType.MaxCapacity * this.quantity) {
        if ( this.guests < this.accommodationType.BaseChild * this.quantity) {
          this.guests++;
          this.totalGuests++;
        } else {
          this.httpError = true;
          this.httpMessage = 'Note that additional charges apply for guests over the base children guest allocation for your accommodation';
          this.guests++;
          this.totalGuests++;
        }
      } else {
        this.httpError = true;
        this.httpMessage = `You may only add a total of ${this.totalGuests} guests for your accommodation/s`;
      }
    }
    subtractGuest() {
      if (this.guests !== 0 ) {
        this.guests--;
        this.totalGuests--;

        this.bookingGuests = [];
      }
    }

    addAdultGuest() {
      if (this.totalGuests < this.accommodationType.MaxCapacity * this.quantity) {
        if (this.adultGuests < this.accommodationType.BaseAdult * this.quantity) {
          this.adultGuests++;
          this.totalGuests++;
        } else {
          this.httpError = true;
          this.httpMessage = 'Note that additional charges apply for guests over the base adult guest allocation for your accommodation';
          this.adultGuests++;
          this.totalGuests++;
        }
      } else {
        this.httpError = true;
        this.httpMessage = `You may only add a total of ${this.totalGuests} guests for your accommodation/s`;
      }

    }
    subtractAdultGuest() {
      if (this.adultGuests > 1) {
        this.adultGuests--;
        this.totalGuests--;

        if (this.bookingGuests.length > this.adultGuests) {
          this.bookingGuests = [];
        }
      } else {
        this.httpError = true;
        this.httpMessage = `Add at least one adult`;
      }
    }

    addQuantity() {
      if (this.quantity < Math.min(...this.availability.map(zz => zz.AvailableAmount))) {
        this.quantity++;
      }
      else {
        this.httpError = true;
        this.httpMessage = `You may only book up to ${this.quantity} units in the date range chosen`;
      }
    }
    subtractQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
        this.guests = 0;
        this.adultGuests = 1;
        this.totalGuests = 1;
      }
      else {
        this.httpError = true;
        this.httpMessage = `You have to choose at least one unit.`;
      }
    }

    AddAdultGuest() {
      const threshold = this.bookingGuests.filter(zz => zz.GuestAge >= 13).length;
      if (threshold < this.adultGuests) {
        this.addModalRef = this.service.show(AddGuestComponent, {
          class: 'modal-md modal-dialog-centered'
        });

        this.addModalRef.content.event.subscribe(res => {
          let flag = false;
          this.bookingGuests.forEach(el => {
            if (el.GuestIDCode === res.GuestIDCode) {
              flag = true;
            }
          });
          if (flag) {
            this.httpError = true;
            this.httpMessage = 'A guest with that ID number is already added';
          } else {
            this.bookingGuests.push(res);
          }
        });
      }
    }

    UpdateGuest(guest) {
      if (guest.GuestAge >= 13) {
        this.UpdateAdultGuest(guest);
      } else if (guest.GuestAge <= 12) {
        this.UpdateChildGuest(guest);
      }
    }

    UpdateAdultGuest(initialData) {
      this.addModalRef = this.service.show(UpdateAdultGuestComponent, {
        class: 'modal-md modal-dialog-centered',
        initialState: {initialData}
      });

      this.addModalRef.content.event.subscribe(res => {
        this.bookingGuests.forEach((el, i) => {
          if (el.GuestIDCode === initialData.GuestIDCode) {
            this.bookingGuests[i] = res;
          }
        });
      });
    }

    DeleteGuest(guest) {
      this.addModalRef = this.service.show(GlobalConfirmComponent, {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you want to remove this guest?'
          }
        }
      });

      this.addModalRef.content.event.subscribe(res => {
        if (res.data) {
          const index = this.bookingGuests.findIndex(zz => zz === guest);

          this.bookingGuests.splice(index, 1);
        }
      });
    }

    UpdateChildGuest(initialData) {
      this.addModalRef = this.service.show(UpdateChildGuestComponent, {
        class: 'modal-md modal-dialog-centered',
        initialState: {initialData}
      });

      this.addModalRef.content.event.subscribe(res => {
        this.bookingGuests.forEach((el, i) => {
          if (el.GuestIDCode === initialData.GuestIDCode) {
            this.bookingGuests[i] = res;
          }
        });
      });
    }

    AddChildGuest() {
      const threshold = this.bookingGuests.filter(zz => zz.GuestAge <= 12).length;
      if (threshold < this.guests) {
        this.addModalRef = this.service.show(AddChildGuestComponent, {
          class: 'modal-md modal-dialog-centered'
        });

        this.addModalRef.content.event.subscribe(res => {
          let flag = false;
          this.bookingGuests.forEach(el => {
            if (el.GuestIDCode === res.GuestIDCode) {
              flag = true;
            }
          });
          if (flag) {
            this.httpError = true;
            this.httpMessage = 'A guest with that ID number is already added';
          } else {
            this.bookingGuests.push(res);
          }
        });
      }
    }

    UpdateBooking() {
      const children = this.bookingGuests.filter(zz => zz.GuestAge <= 12).length;
      const adults = this.bookingGuests.filter(zz => zz.GuestAge >= 13).length;
      console.log('here1');
      console.log(children, this.guests);
      console.log(adults, this.adultGuests);
      if (children === this.guests && adults === this.adultGuests) {
        console.log('here2');
        const accItin: AccommodationBooking = {
          AccommodationTypeID: this.initialData.AccommodationTypeID,
          ParkID: this.initialData.ParkID,
          CampID: this.initialData.campID,
          BookingQuantity: this.quantity,
          StartDate: this.bsRangeValue[0],
          EndDate: this.bsRangeValue[this.bsRangeValue.length - 1 ],
          Guests: this.bookingGuests,
          CampName: this.initialData.CampName,
          ParkName: this.initialData.ParkName,
          BaseRate: null,
          AccommodationTypeName: this.initialData.AccommodationTypeName
        };

        console.log(accItin);
        const BookingsItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
        if (BookingsItinerary) {
          // there are bookings in the itinerary already
          BookingsItinerary.AccommodationBookings.push(accItin);
          localStorage.setItem('itinerary', JSON.stringify(BookingsItinerary));
          this.router.navigate(['itinerary']);
          this.close();
          this.bsModalRef.hide();
        } else {
          // if theres no bookings in the itinerary
          const initialItinerary: Booking = {
            ClientID: null,
            BookingID: null,
            ConservationAmount: null,
            PaymentAmount: null,
            TotalAmount: null,
            EmployeeID: null,
            paymentToken: null,
            PaidConservationFee: false,
            AccommodationBookings: [],
            ActivityBookings: [],
            DayVisits: [],
            Session: null
          };

          initialItinerary.AccommodationBookings.push(accItin);
          localStorage.setItem('itinerary', JSON.stringify(initialItinerary));
          this.bsModalRef.hide();
          this.close();
          this.router.navigate(['itinerary']);
        }
      } else {
        this.httpError = true;
        this.httpMessage = 'Make sure you enter the correct amount of adult and child guests';
      }
    }
}
