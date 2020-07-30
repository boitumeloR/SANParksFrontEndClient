import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConfirmComponent } from '../global-confirm/global-confirm.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent implements OnInit {
  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef,
              private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  close() {
    this.bsModalRef.hide();
  }

  Confirm() {
    this.bsModalRef.hide();
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Are you sure you would like to remove this booking?'
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      if (res.data === true) {
        this.router.navigateByUrl('claimRefund');
        this.snackBar.open('You now qualify for a booking refund', 'Okay', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }
    });
  }
}
