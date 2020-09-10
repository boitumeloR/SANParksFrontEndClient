import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ViewBookingComponent } from 'src/app/modals/view-booking/view-booking.component';
import { AddGuestComponent } from 'src/app/modals/add-guest/add-guest.component';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.scss']
})
export class BookingSuccessComponent implements OnInit {


  CampsBooked: any[];
  closeGates: any[];
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private router: Router,
              private global: GlobalService, private serv: BookingService,
              private snack: MatSnackBar) { }
  quantity = 1;
  ngOnInit(): void {
    const itinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
    itinerary.AccommodationBookings.forEach(element => this.CampsBooked.push(element.CampID));
    itinerary.ActivityBookings.forEach(element => this.CampsBooked.push(element.CampID));
    console.log(this.CampsBooked);
  }

  viewBooking(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewBookingComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  addGuest(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddGuestComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  Confirm() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you would like to update this booking?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.router.navigateByUrl('bookingPayment');
      }
    });
  }


  Cancel() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you would like to cancel this update?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.router.navigateByUrl('myBookings');
      }
    });
  }

  Gates() {
    this.serv.getClosestGates(this.global.GetServer(), this.CampsBooked).subscribe(res => {
      if (res.ParkGates) {
        this.Gates = res;
        localStorage.setItem('gates', JSON.stringify(this.Gates));
      } else {
        localStorage.removeItem('itinerary');
        this.snack.open(`An error occured on our servers, sorry.`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 10000
        }).afterDismissed().subscribe(() => {
          localStorage.removeItem('itinerary');
          this.router.navigateByUrl('');
        });
      }
    });
  }
  removeGuest() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you would like to remove this guest?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  addQuantity() {
    this.quantity++;
  }
  subtractQuantity() {
    this.quantity--;
  }
}
