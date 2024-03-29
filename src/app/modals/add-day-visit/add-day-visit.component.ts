import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { AddChildGuestComponent } from '../childGuest/add-child-guest/add-child-guest.component';
import { AccommodationBooking, Booking, DayVisitBooking } from 'src/app/services/booking/booking.service';
import { AddArbitraryGuestComponent } from '../add-arbitrary-guest/add-arbitrary-guest.component';
import { GlobalConfirmComponent } from '../global-confirm/global-confirm.component';
import { UpdateArbitraryGuestComponent } from '../update-arbitrary-guest/update-arbitrary-guest.component';

@Component({
  selector: 'app-add-day-visit',
  templateUrl: './add-day-visit.component.html',
  styleUrls: ['./add-day-visit.component.scss']
})
export class AddDayVisitComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  quantity = 1;
  guests = 1;
  adultGuests = 1;
  totalGuests = 2;

  maxQuantity: number;
  availability: any[] = [];
  enterGuest = true;
  config = {
    animated: true,
    backdrop: 'static'
  };
  initialData: any;
  initialDate: Date[];
  bsValue: Date;
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
    this.availability = this.initialData.Dates;
    const Dates = JSON.parse(localStorage.getItem('Dates'));
    console.log(this.minDate, this.maxDate);
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  parseDate(input): Date {
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

  addGuest() {
    if ( this.guests < this.initialData.GateLimit) {
      this.guests++;
      this.totalGuests++;
    } else {
      this.httpError = true;
      this.httpMessage = `You may only add ${this.guests} children for your visit`;
    }
  }

  ChangeDate() {
    console.log(this.availability);
    const avail: number = this.availability.findIndex(zz => this.bsValue);
    console.log(this.parseDate(this.initialData.Dates[3].Date));
    console.log(this.bsValue);
    console.log(avail);
    this.maxQuantity = this.availability[avail].SlotsAvailable;
    if (this.maxQuantity === 0) {
      this.httpError = true;
      this.httpMessage = 'There are no slots available on this date, pick another date.';
    }
  }

  subtractGuest() {
    if (this.guests !== 0 ) {
      this.guests--;
      this.totalGuests--;
    }
  }

  addAdultGuest() {
    if (this.adultGuests < this.initialData.GateLimit) {
      this.adultGuests++;
      this.totalGuests++;
    } else {
      this.httpError = true;
      this.httpMessage = `You may only add ${this.adultGuests} adults for your visit`;
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
    if (this.quantity < Math.min(...this.initialData.Availability.map(zz => zz.AvailableAmount))) {
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
    }
    else {
      this.httpError = true;
      this.httpMessage = `You have to choose at least one unit.`;
    }
  }

  AddAdultGuest() {
    if (this.bookingGuests.length < this.adultGuests) {
      this.addModalRef = this.service.show(AddArbitraryGuestComponent, {
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

  AddChildGuest() {
    this.addModalRef = this.service.show(AddChildGuestComponent, {
      class: 'modal-md modal-dialog-centered'
    });

    this.addModalRef.content.event.subscribe(res => {
      console.log(res);
      this.bookingGuests.push(res);
    });
  }

  UpdateGuest(initialData) {
    this.addModalRef = this.service.show(UpdateArbitraryGuestComponent, {
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

  addToItinerary() {
    console.log('here1');
    if (this.bookingGuests.length === this.adultGuests) {
      console.log(this.initialData);
      const accItin: DayVisitBooking = {
        Date: this.bsValue,
        Guests: this.bookingGuests,
        ParkName: this.initialData.ParkName,
        ParkGateID: this.initialData.ParkGateID,
        ParkID: this.initialData.ParkID,
        ParkGateName: this.initialData.ParkGate,
        Rate: 0
      };

      console.log(accItin);
      const BookingsItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
      if (BookingsItinerary) {
        // there are bookings in the itinerary already
        BookingsItinerary.DayVisits.push(accItin);
        localStorage.setItem('itinerary', JSON.stringify(BookingsItinerary));
        this.router.navigate(['itinerary']);
        this.close();
      } else {
        // if theres no bookings in the itinerary
        const initialItinerary: Booking = {
          ClientID: null,
          BookingID: null,
          ConservationAmount: null,
          PaymentAmount: null,
          TotalAmount: null,
          EmployeeID: null,
          PaidConservationFee: false,
          paymentToken: null,
          AccommodationBookings: [],
          ActivityBookings: [],
          DayVisits: [],
          Session: null
        };

        initialItinerary.DayVisits.push(accItin);
        localStorage.setItem('itinerary', JSON.stringify(initialItinerary));
        this.router.navigate(['itinerary']);
        this.close();
      }
    } else {
      this.httpError = true;
      this.httpMessage = 'Make sure you enter the correct amount of guests';
    }
  }
}
