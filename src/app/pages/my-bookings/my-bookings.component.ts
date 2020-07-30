import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewWildcardDetailsComponent } from 'src/app/modals/view-wildcard-details/view-wildcard-details.component';
import { ViewBookingComponent } from 'src/app/modals/view-booking/view-booking.component';
import { Router } from '@angular/router';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private router: Router) { }

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

  Confirm() {
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you would like to cancel this booking?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.router.navigateByUrl('');
      }
    });
  }
}
