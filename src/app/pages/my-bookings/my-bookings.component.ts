import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewWildcardDetailsComponent } from 'src/app/modals/view-wildcard-details/view-wildcard-details.component';
import { ViewBookingComponent } from 'src/app/modals/view-booking/view-booking.component';
import { Router } from '@angular/router';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  bsModalRef: BsModalRef;
  clientID: number;
  bookings: any[] = [];
  constructor(private modalService: BsModalService, private router: Router,
              private snack: MatSnackBar, private global: GlobalService,
              private serv: BookingService) { }

  ngOnInit(): void {
    const session = JSON.parse(sessionStorage.getItem('session'));

    if (session) {
      this.serv.getClientFromSession(session, this.global.GetServer()).subscribe(res => {
        if (!res.Error) {
          this.clientID = res.ClientID;
          console.log(res.ClientID);
          sessionStorage.setItem('session', JSON.stringify(res.Session));
          this.serv.getClientBookings(this.global.GetServer(), this.clientID).subscribe(result => {
            if (!result.Error) {
              this.bookings = result.Bookings.Bookings;
              this.bookings.sort((a, b) => b.BookingID - a.BookingID ); // latest booked first
              console.log(this.bookings);
              sessionStorage.setItem('session', JSON.stringify(result.Session));
            } else {
              this.snack.open(result.Error, 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
              });
              this.router.navigateByUrl('Login');
            }
          });
        } else {
          this.snack.open(res.Error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
          this.router.navigateByUrl('Login');
        }
      });
    } else {
      this.router.navigateByUrl('Login');
    }
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
  Cancel() {
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
        this.router.navigateByUrl('claimRefund');
      }
    });
  }
  Error(){
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: 'Invalid Date Range'
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
