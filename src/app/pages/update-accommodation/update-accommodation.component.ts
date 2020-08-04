import { Component, OnInit } from '@angular/core';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { ViewBookingComponent } from 'src/app/modals/view-booking/view-booking.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AddGuestComponent } from 'src/app/modals/add-guest/add-guest.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-update-accommodation',
  templateUrl: './update-accommodation.component.html',
  styleUrls: ['./update-accommodation.component.scss']
})
export class UpdateAccommodationComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private router: Router,
              private snack: MatSnackBar) { }
  quantity = 1;
  ngOnInit(): void {
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
            message: 'Are you sure you would like to cancel this update?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.router.navigateByUrl('updatedBooking');
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
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.snack.open('Successfully Deleted Guest', 'Okay', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  Message() {
    this.snack.open('There are no available slots for this date.', 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  addQuantity() {
    this.quantity++;
  }
  subtractQuantity() {
    this.quantity--;
  }
  
}
