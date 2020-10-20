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
import { UpdateAccommodationBookingComponent } from 'src/app/modals/update-accommodation-booking/update-accommodation-booking.component';
import { AvailabilityBoxComponent } from 'src/app/sub-components/availability-box/availability-box.component';
import { AvailabilityService } from 'src/app/services/available/availability.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  loading = false;
  bsModalRef: BsModalRef;
  clientID: number;
  bookings: any[] = [];
  nowDate = new Date();
  constructor(private modalService: BsModalService, private router: Router,
              private snack: MatSnackBar, private global: GlobalService,
              private serv: BookingService, private avail: AvailabilityService) { }

  ngOnInit(): void {
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (session) {
      this.serv.getClientFromSession(session, this.global.GetServer()).subscribe(res => {
        if (!res.Error) {
          this.clientID = res.ClientID;
          console.log(res.ClientID);
          sessionStorage.setItem('session', JSON.stringify(res.Session));
          this.serv.getClientBookings(this.global.GetServer(), this.clientID).subscribe(result => {
            this.loading = false;
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
      sessionStorage.removeItem('session');
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
  parseDate(input) {
    const parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
  }

  UpdateAccommodationBooking(acc) {
    // Check Month Availability
    this.loading = true;
    const start = this.parseDate(acc.StartDate);
    const base: Date = new Date();
    const end: Date = new Date(start.setMonth(start.getMonth() + 2));

    console.log(end);
    console.log(base);
    const availableData = {
      ParkID: null,
      CampID: acc.CampID,
      AccommodationChecked: true,
      ActivityChecked: false,
      DayVisitChecked: false,
      AccommodationTypeID: acc.AccommodationTypeID,
      ActivityTypeID: null,
      Forward: true,
      BaseDate: base,
      EndDate: end
    };

    console.log(availableData);
    this.avail.checkSpecificAvailability(availableData, this.global.GetServer())
    .subscribe(res => {
      console.log(res);
      this.loading = false;
      localStorage.setItem('Dates', JSON.stringify(res.Dates));

      this.bsModalRef = this.modalService.show(UpdateAccommodationBookingComponent,
        {
          backdrop: 'static',
          class: 'modal-md modal-dialog-centered',
          initialState: {
            initialData: {
              AvailableResults: res.AvailableResults[0],
              CurrentBooking: acc
            }
          }
        });
      this.bsModalRef.content.closeBtnName = 'Close';
    });
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
          successMessage: modalString
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
