import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';
import { AccommodationBooking, Booking, ActivityBooking, BookingService } from 'src/app/services/booking/booking.service';
import { AddArbitraryGuestComponent } from '../add-arbitrary-guest/add-arbitrary-guest.component';
import { GlobalConfirmComponent } from '../global-confirm/global-confirm.component';
import { UpdateAdultGuestComponent } from '../update-adult-guest/update-adult-guest.component';
import { UpdateChildGuestComponent } from '../update-child-guest/update-child-guest.component';
import { UpdateArbitraryGuestComponent } from '../update-arbitrary-guest/update-arbitrary-guest.component';

@Component({
  selector: 'app-add-activity-booking',
  templateUrl: './add-activity-booking.component.html',
  styleUrls: ['./add-activity-booking.component.scss']
})
export class AddActivityBookingComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  quantity = 1;
  guests = 1;
  adultGuests = 1;
  totalGuests = 2;

  maxGuests = 0;
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

  ActivitySlots: any[];
  addModalRef: BsModalRef;
  selectedSlot = 0;

  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder, private service: BsModalService,
              private serv: AvailabilityService, private global: GlobalService, private router: Router,
              private bookingServ: BookingService) {
    const Dates = JSON.parse(localStorage.getItem('Dates'));
    this.minDate = this.parseDate(Dates[0].Date);
    this.maxDate = this.parseDate(Dates[Dates.length - 1].Date);
   }

  ngOnInit(): void {
    console.log(this.initialData);
    this.bookingServ.getActivitySlots(this.global.GetServer(), this.initialData.ActivityID, this.initialData.CampID)
    .subscribe(res => {
      this.ActivitySlots = res.ActivitySlots;
      this.selectedSlot = this.ActivitySlots[0].SlotID;
    });
    const Dates = JSON.parse(localStorage.getItem('Dates'));
    this.bsValue = this.parseDate(Dates[0].Date);
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
    if (this.guests < Math.min(...this.initialData.Availability.map(zz => zz.AvailableAmount)) ) {
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

  SlotAvailability() {
    if (this.selectedSlot > 0) {
      const checkObj = {
        BaseDate: this.bsValue,
        SlotID: this.selectedSlot,
        CampID: this.initialData.CampID
      };
      this.serv.checkSlotAvailability(checkObj, this.global.GetServer()).subscribe(res => {
        this.maxGuests = res;
        if (res === 0) {
          this.httpError = true;
          this.httpMessage = `There are no more spaces available in this time slot`;
        }
      });
    }
  }

  addAdultGuest() {
    console.log(Math.min(...this.initialData.Availability.map(zz => zz.AvailableAmount)));
    if (this.adultGuests < this.maxGuests) {
      this.adultGuests++;
      this.totalGuests++;
    } else {
      this.httpError = true;
      this.httpMessage = `You may only add ${this.adultGuests} guests for your activity`;
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
      this.httpMessage = `Add at least one guest`;
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
    console.log('Booked Date: ' , this.bsValue);
    if (this.bookingGuests.length === this.adultGuests) {
      this.loader = true;
      console.log('here2');
      const accItin: ActivityBooking = {
        ParkID: this.initialData.ParkID,
        CampID: this.initialData.campID,
        StartDate: this.bsValue,
        Guests: this.bookingGuests,
        CampName: this.initialData.CampName,
        ParkName: this.initialData.ParkName,
        ActivityRate: null,
        ActivityID: this.initialData.ActivityID,
        ActivityName: this.initialData.ActivityName,
        SlotID: this.selectedSlot // to be dropped down
      };

      console.log(accItin);
      const BookingsItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
      if (BookingsItinerary) {
        // there are bookings in the itinerary already
        BookingsItinerary.ActivityBookings.push(accItin);
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

        initialItinerary.ActivityBookings.push(accItin);
        localStorage.setItem('itinerary', JSON.stringify(initialItinerary));
        this.router.navigate(['itinerary']);
        this.bsModalRef.hide();
        this.close();
      }
    } else {
      this.httpError = true;
      this.httpMessage = 'Make sure you enter the correct amount of guests';
    }
  }
}
