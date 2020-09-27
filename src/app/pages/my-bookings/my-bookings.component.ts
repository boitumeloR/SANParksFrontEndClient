import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewWildcardDetailsComponent } from 'src/app/modals/view-wildcard-details/view-wildcard-details.component';
import { ViewBookingComponent } from 'src/app/modals/view-booking/view-booking.component';
import { Router } from '@angular/router';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { Booking, BookingService } from 'src/app/services/booking/booking.service';
import { Session } from 'src/app/services/Auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessModalComponent } from 'src/app/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  bsModalRef: BsModalRef;
  clientID: number;
  bookings: any[] = [];
  nowDate = new Date();
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
              this.bookings.map(zz => {
                if (new Date(zz.ArrivalDate) > this.nowDate) {
                  zz.ValidCancel = true;
                } else {
                  zz.ValidCancel = false;
                }
              });
              this.bookings.sort((a, b) => b.BookingID - a.BookingID ); // latest booked first
              console.log(this.bookings);
              console.log(this.nowDate);
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

  refreshBookings() {
    const session = JSON.parse(sessionStorage.getItem('session'));
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
  }

  ShowSuccessModal(modalString) {
    this.bsModalRef = this.modalService.show(SuccessModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {
          data: {
            message: modalString
          }
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  Cancel(booking) {
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
        const session: Session = JSON.parse(sessionStorage.getItem('session'));
        const bookingInfo: Booking = {
          ClientID: null,
          BookingID: booking.BookingID,
          ConservationAmount: null,
          PaymentAmount: null,
          TotalAmount: null,
          EmployeeID: null,
          PaidConservationFee: false,
          paymentToken: null,
          AccommodationBookings: [],
          ActivityBookings: [],
          DayVisits: [],
          Session: session
        };
        this.serv.CancelBooking(bookingInfo, this.global.GetServer()).subscribe(result => {
        if (result.Session === null) {
          this.router.navigateByUrl('Login');
          this.snack.open(result.Error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        } else {
          sessionStorage.setItem('session', JSON.stringify(result.Session));

          if (result.Cancelled === true) {
            const modalStr = `You have successfully cancelled your booking,
            if you qualify for a refund it will reflect on your side in the next few days.`;

            this.ShowSuccessModal(modalStr);
            this.refreshBookings();
          } else if (result.Cancelled === false) {
            this.snack.open(result.Error, 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });
          }
        }
        }, (err: HttpErrorResponse) => {
          // Server down.
        });
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
