import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ViewAvailableImgComponent } from 'src/app/modals/view-available-img/view-available-img.component';
import { RemoveGuestConfirmComponent } from 'src/app/modals/remove-guest-confirm/remove-guest-confirm.component';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';
import { AddGuestComponent } from 'src/app/modals/add-guest/add-guest.component';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {

  payAmount = 0;
  payPerc = 0;
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    this.payAmount = 1;
  }

  openImageModal() {
    console.log('hello');

    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(RemoveGuestConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  confirmRemoveGuest() {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(RemoveGuestConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered'
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
