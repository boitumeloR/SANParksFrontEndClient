import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { AddChildGuestComponent } from '../childGuest/add-child-guest/add-child-guest.component';
import { AccommodationBooking, Booking, DayVisitBooking } from 'src/app/services/booking/booking.service';

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

  enterGuest = true;
  config = {
    animated: true,
    backdrop: 'static'
  };
  initialData: any;
  initialDate: Date[];
  bsValue = new Date();
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
    const Dates = JSON.parse(localStorage.getItem('Dates'));
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

  addGuest() {
    if ( this.guests < this.initialData.ChildLimit * this.quantity) {
      this.guests++;
      this.totalGuests++;
    } else {
      this.httpError = true;
      this.httpMessage = `You may only add ${this.guests} children for your accommodation/s`;
    }
  }
  subtractGuest() {
    if (this.guests !== 0 ) {
      this.guests--;
      this.totalGuests--;
    }
  }

  addAdultGuest() {
    if (this.adultGuests < this.initialData.ParkGateMax ) {
      this.adultGuests++;
      this.totalGuests++;
    } else {
      this.httpError = true;
      this.httpMessage = `You may only add ${this.adultGuests} guests for this Park Gate`;
    }

  }
  subtractAdultGuest() {
    if (this.adultGuests > 1) {
      this.adultGuests--;
      this.totalGuests--;
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
    this.addModalRef = this.service.show(AddGuestComponent, {
      class: 'modal-md modal-dialog-centered'
    });

    this.addModalRef.content.event.subscribe(res => {
      this.bookingGuests.push(res);
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
