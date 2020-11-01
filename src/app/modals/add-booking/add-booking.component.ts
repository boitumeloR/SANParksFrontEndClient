import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { AddChildGuestComponent } from '../childGuest/add-child-guest/add-child-guest.component';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GlobalService } from 'src/app/services/global/global.service';
import { Booking, AccommodationBooking } from 'src/app/services/booking/booking.service';
import { Router } from '@angular/router';
import { UpdateAdultGuestComponent } from '../update-adult-guest/update-adult-guest.component';
import { UpdateChildGuestComponent } from '../update-child-guest/update-child-guest.component';
import { GlobalConfirmComponent } from '../global-confirm/global-confirm.component';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit, AfterViewInit{

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  quantity = 1;
  guests = 1;
  adultGuests = 1;
  totalGuests = 2;

  maxQuantity: number;
  enterGuest = true;
  config = {
    animated: true,
    backdrop: 'static'
  };
  initialData: any;
  initialDate: Date[];
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate: Date;
  minDate: Date;

  availability: any[] = [];
  bookingGuests: any[] = [];
  httpError = false;
  httpMessage = '';

  loader = false;

  addModalRef: BsModalRef;

  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder, private service: BsModalService,
              private serv: AvailabilityService, private global: GlobalService, private router: Router) {
    const Dates = JSON.parse(localStorage.getItem('Date'));
    this.minDate = this.parseDate(Dates[0].Date);
    this.maxDate = this.parseDate(Dates[Dates.length - 1].Date);
   }

  ngOnInit(): void {
    console.log(this.initialData);

    this.availability = JSON.parse(localStorage.getItem('avail'));
    const Dates = JSON.parse(localStorage.getItem('Date'));
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

  ngAfterViewInit() {
    this.bsRangeValue = [new Date(), new Date()];
    const minimum = this.availability.filter(zz => this.parseDate(zz.Date) <= this.bsRangeValue[this.bsRangeValue.length - 1] &&
    this.parseDate(zz.Date) >= this.bsRangeValue[0])
      .map(zz => zz.AvailableAmount);
  }
  ChangedDate() {
    const minimum = this.availability.filter(zz => this.parseDate(zz.Date) <= this.bsRangeValue[this.bsRangeValue.length - 1] &&
    this.parseDate(zz.Date) >= this.bsRangeValue[0])
      .map(zz => zz.AvailableAmount);

    console.log(minimum);
    this.maxQuantity = Math.min(...minimum);

    if (this.maxQuantity === 0) {
      this.httpError = true;
      this.httpMessage = 'There are no units in the range picked, please try another date range.';
    }
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
    if (this.totalGuests < this.initialData.MaxCapacity * this.quantity) {
      if ( this.guests < this.initialData.BaseChild * this.quantity) {
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
    if (this.totalGuests < this.initialData.MaxCapacity * this.quantity) {
      if (this.adultGuests < this.initialData.BaseAdult * this.quantity) {
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
    if (this.quantity < this.maxQuantity) {
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

  addToItinerary() {
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
