import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TableDate, AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewAvailableComponent } from 'src/app/modals/view-available/view-available.component';
import { Booking } from 'src/app/services/booking/booking.service';
import { AddActivityBookingComponent } from 'src/app/modals/add-activity-booking/add-activity-booking.component';
import { AddDayVisitComponent } from 'src/app/modals/add-day-visit/add-day-visit.component';

@Component({
  selector: 'app-table-results',
  templateUrl: './table-results.component.html',
  styleUrls: ['./table-results.component.scss']
})
export class TableResultsComponent implements OnInit {

  availableGroup: FormGroup;
  isAccommodation: boolean;
  isActivity: boolean;

  notFound = false;
  // Observables
  dropDowns$: Observable<any>;
  parkDrop$: Observable<any>;
  activityDrop$: Observable<any>;
  accommodationDrop$: Observable<any>;
  dayDrop$: Observable<any>;
  checkAvailability$: Observable<any>;

  // Errors
  httpError = false;
  httpMessage = '';
  // Dropdown content
  parks: any[];
  camps: any[];
  activityTypes: any[];
  accommodationTypes: any[];

  checks = 0;
  tableDates: TableDate[];
  availableResults: any[];
  apiData: any;
  searchData: any;
  parkName: string;
  datePicked: Date;
  startDate = new Date();
  placeDate = new Date();
  boundaryDate: Date = new Date(this.placeDate.setMonth(this.placeDate.getMonth() + 11));
  head = 'head';
  loader = false;
  mapLoader = false;
  isOpen = true;
  bsModalRef: BsModalRef;
  constructor(private router: Router, private serv: AvailabilityService,
              private global: GlobalService, private snack: MatSnackBar,
              private modalService: BsModalService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dropDowns$ = this.serv.getDropDowns(this.global.GetServer());
    this.dropDowns$.subscribe(res => {
      this.parks = res.Parks;
      this.isAccommodation = true;
      this.isActivity = true;
    }, (error: HttpErrorResponse) => {
      this.httpError = true;
      this.httpMessage = error.message;
    });

    this.notFound = false;
    this.apiData = JSON.parse(localStorage.getItem('availableResults'));
    this.searchData = JSON.parse(localStorage.getItem('searchData'));

    if (this.apiData && this.searchData) {
      this.availableResults = this.apiData.AvailableResults;
      if (this.availableResults.length === 0) {
        this.notFound = true;
        this.snack.open(`Nothing was available from your search, try other parameters.`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 10000
        }).afterDismissed().subscribe(() => {
          this.loader = false;
        });
      }
      else {
        this.notFound = false;
        console.log(this.availableResults);
        this.tableDates = this.apiData.Dates;
        this.parkName = this.apiData.ParkName;
      }
    } else {
      this.isAccommodation = true;
      this.isActivity = true;
      console.log(this.isAccommodation, this.isActivity);

      this.availableGroup = this.formBuilder.group({
        park: [null, Validators.required],
        camp: [null],
        activity: [false],
        accommodation: [false],
        day: [false],
        activityType: [null],
        accommodationType: [null]
      });
    }

    // populate dropdown park
    this.dropDowns$ = this.serv.getDropDowns(this.global.GetServer());
    this.dropDowns$.subscribe(res => {
      this.parks = res.Parks;
      this.isAccommodation = true;
      this.isActivity = true;
    }, (error: HttpErrorResponse) => {
      this.httpError = true;
      this.httpMessage = error.message;
    });

    // initialise form
    if (this.searchData) {

      this.isAccommodation = true;
      this.isActivity = true;
      console.log(this.isAccommodation, this.isActivity);

      this.availableGroup = this.formBuilder.group({
        park: [this.searchData.ParkID, Validators.required],
        camp: [this.searchData.CampID],
        activity: [false],
        accommodation: [false],
        day: [false],
        activityType: [this.searchData.ActivityTypeID],
        accommodationType: [this.searchData.AccommodationTypeID]
      });
    }
  }

  // functions for check form

  onChoosePark() {
    if (this.availableGroup.get('park').valid) {
      this.parkDrop$ = this.serv.getCamps(this.availableGroup.get('park').value, this.global.GetServer());
      this.parkDrop$.subscribe(res =>  {
        this.camps = res;
      }, (error: HttpErrorResponse) => {
        this.httpError = true;
        this.httpMessage = error.message;
      });
    }
    else {
      this.httpError = true;
      this.httpMessage = 'Choose a park on this list';
    }
  }

  onChooseCamp() {
    // Assign camp
  }

  onChooseAct() {
    if (this.availableGroup.valid) {
      console.log(this.availableGroup);
      if (this.availableGroup.get('activity').value === true) {
        const values = {
          parkID: this.availableGroup.get('park').value,
          campID: this.availableGroup.get('camp').value
        };

        this.availableGroup.get('accommodation').setValue(false);
        this.availableGroup.get('day').setValue(false);
        this.isAccommodation = true;
        console.log(values);
        this.activityDrop$ = this.serv.getActivityTypes(values, this.global.GetServer());
        this.activityDrop$.subscribe(res => {
          this.activityTypes = res;
          this.checks++;
        }, (error: HttpErrorResponse) => {
          this.httpError = true;
          this.httpMessage = error.message;
        });
      }
    } else {
      this.httpError = true;
      this.httpMessage = 'Make Sure to choose a park before submiting';
    }
  }

  onChooseAcc() {
    if (this.availableGroup.valid) {
      if (this.availableGroup.get('accommodation').value === true) {
        const values = {
          parkID: this.availableGroup.get('park').value,
          campID: this.availableGroup.get('camp').value
        };

        this.availableGroup.get('activity').setValue(false);
        this.availableGroup.get('day').setValue(false);
        this.isActivity = true;

        this.activityDrop$ = this.serv.getAccommodationTypes(values, this.global.GetServer());
        this.activityDrop$.subscribe(res => {
          this.accommodationTypes = res;
          this.checks++;
        }, (error: HttpErrorResponse) => {
          this.httpError = true;
          this.httpMessage = error.message;
        });
      }
    } else {
      this.httpError = true;
      this.httpMessage = 'Make Sure to choose a park before submiting';

      if (this.availableGroup.get('accommodation').value === true) {
        const values = {
          parkID: this.availableGroup.get('park').value,
          campID: this.availableGroup.get('camp').value
        };

        this.availableGroup.get('activity').setValue(false);
        this.availableGroup.get('day').setValue(false);
        this.isActivity = true;

        this.activityDrop$ = this.serv.getAccommodationTypes(values, this.global.GetServer());
        this.activityDrop$.subscribe(res => {
          this.accommodationTypes = res;
          this.checks++;
        }, (error: HttpErrorResponse) => {
          this.httpError = true;
          this.httpMessage = error.message;
        });
      }
    }
  }

  onChooseDay() {
    if (this.availableGroup.valid) {
      this.availableGroup.get('activity').setValue(false);
      this.availableGroup.get('accommodation').setValue(false);

      this.isActivity = true;
      this.isAccommodation = true;
    }
    else {
      this.httpError = true;
      this.httpMessage = 'Make Sure to choose a park before submiting';

      this.availableGroup.get('activity').setValue(false);
      this.availableGroup.get('accommodation').setValue(false);

      this.isActivity = true;
      this.isAccommodation = true;
    }
  }

  CheckAvailability() {
    if (this.availableGroup.valid) {
      if (this.availableGroup.get('accommodation').value === false
      && this.availableGroup.get('activity').value === false &&
      this.availableGroup.get('day').value === false ||
      this.availableGroup.get('accommodation').value === null
      && this.availableGroup.get('activity').value === null &&
      this.availableGroup.get('day').value === null){
        this.httpError = true;
        this.httpMessage = 'Choose a booking type!';
      } else {
        this.loader = true;
        const availableData = {
          ParkID: Number(this.availableGroup.get('park').value) ,
          CampID: this.availableGroup.get('camp').value,
          AccommodationChecked: this.availableGroup.get('accommodation').value,
          ActivityChecked: this.availableGroup.get('activity').value,
          DayVisitChecked: this.availableGroup.get('day').value,
          AccommodationTypeID: this.availableGroup.get('accommodationType').value,
          ActivityTypeID: this.availableGroup.get('activityType').value,
          Forward: true,
          BaseDate: this.tableDates[0].Date
        };

        console.log(availableData);

        this.checkAvailability$ = this.serv.checkAvailability(availableData, this.global.GetServer());
        this.checkAvailability$.subscribe(res => {
          this.loader = false;
          this.apiData = res;
          this.searchData = availableData;
          this.availableResults = res.AvailableResults;
          if (this.availableResults.length === 0) {
            this.notFound = true;
          }
          else {
            this.notFound = false;
          }
          localStorage.setItem('availableResults', JSON.stringify(res));
          localStorage.setItem('searchData', JSON.stringify(availableData));

          this.searchData = availableData;
        }, (error: HttpErrorResponse) => {
          this.httpError = true;
          this.httpMessage = error.message;
        });
        console.log(availableData);
      }
    }
    // this.router.navigateByUrl('availableResults');
  }

  toggleAccommodationCollapse() {
    this.isAccommodation = !this.isAccommodation;
  }

  toggleActivityCollapse() {
    this.isActivity = !this.isActivity;
  }

  resetHttp() {
    this.httpError = false;
    this.httpMessage = '';
  }
  // end


  chooseDate(event: Event) {
    this.searchData.BaseDate = event;
    this.searchData.Forward = true;
    this.loader = true;

    this.checkAvailability$ = this.serv.checkAvailability(this.searchData, this.global.GetServer());
    this.checkAvailability$.subscribe(res => {
      this.availableResults = res.AvailableResults;
      this.tableDates = res.Dates;
      this.loader = false;
      this.isOpen = true;
      localStorage.setItem('availableResults', JSON.stringify(res));
      localStorage.setItem('searchData', JSON.stringify(this.searchData));
    }, (error: HttpErrorResponse) => {
      this.snack.open(`An error occured on our servers: ${error.message}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      }).afterDismissed().subscribe(() => {
        this.loader = false;
      });
      this.httpError = true;
      this.httpMessage = error.message;
    });
  }

  nextWeek() {
    this.loader = true;
    this.searchData.Forward = true;
    this.searchData.BaseDate = this.tableDates[this.tableDates.length - 1].Date;

    this.checkAvailability$ = this.serv.checkAvailability(this.searchData, this.global.GetServer());
    this.checkAvailability$.subscribe(res => {
      this.availableResults = res.AvailableResults;
      this.tableDates = res.Dates;
      this.loader = false;
      this.isOpen = true;
      localStorage.setItem('availableResults', JSON.stringify(res));
      localStorage.setItem('searchData', JSON.stringify(this.searchData));
    }, (error: HttpErrorResponse) => {
      this.snack.open(`An error occured on our servers: ${error.message}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      }).afterDismissed().subscribe(() => {
        this.loader = false;
      });
      this.httpError = true;
      this.httpMessage = error.message;
    });
  }

  pastWeek() {
    this.loader = true;
    this.searchData.Forward = false;
    this.searchData.BaseDate = this.tableDates[0].Date;

    this.checkAvailability$ = this.serv.checkAvailability(this.searchData, this.global.GetServer());
    this.checkAvailability$.subscribe(res => {
      this.availableResults = res.AvailableResults;
      this.tableDates = res.Dates;
      this.loader = false;
      localStorage.setItem('availableResults', JSON.stringify(res));
      localStorage.setItem('searchData', JSON.stringify(this.searchData));
    }, (error: HttpErrorResponse) => {
      this.snack.open(`An error occured on our servers: ${error.message}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
      this.httpError = true;
      this.httpMessage = error.message;
    });
  }


  ViewAccommodationModal(accommodation): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewAvailableComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {accommodation}
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    }

    ViewActivityModal(activity): void {
      const initialState = {
        backdrop: 'static'
      };
      this.bsModalRef = this.modalService.show(ViewAvailableComponent,
        {
          class: 'modal-md modal-dialog-centered',
          initialState: {activity}
        });
      this.bsModalRef.content.closeBtnName = 'Close';
      }

ValidateSamePark(initialData) {
  const BookingItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
  let ParkIDs = [];
  let flag = false;
  if (BookingItinerary) {
    ParkIDs = ParkIDs.concat(BookingItinerary.AccommodationBookings.filter(zz => zz.ParkID !== initialData.ParkID).map(zz => zz.ParkID));
    ParkIDs = ParkIDs.concat(BookingItinerary.ActivityBookings.filter(zz => zz.ParkID !== initialData.ParkID).map(zz => zz.ParkID));
    if (ParkIDs.length > 0) {
      flag = true;
    }
  }
  return flag;
}

bookDayVisit(initialData) {
  const BookingItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
  let ParkIDs = [];
  let flag = false;
  console.log(initialData);
  if (BookingItinerary) {
    ParkIDs = ParkIDs.concat(BookingItinerary.AccommodationBookings.filter(zz => zz.ParkID !== initialData.ParkID).map(zz => zz.ParkID));
    ParkIDs = ParkIDs.concat(BookingItinerary.ActivityBookings.filter(zz => zz.ParkID !== initialData.ParkID).map(zz => zz.ParkID));
    if (ParkIDs[0] !== undefined) {
      flag = true;
    }
  }

  if (flag) {
    this.snack.open('You have reservations in a different Park, you may only book at one park', 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000
    });
  } else {

    localStorage.setItem('Dates', JSON.stringify(initialData.Dates));
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddDayVisitComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: {initialData}
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}

addActivityModal(initialData) {
  localStorage.setItem('Dates', JSON.stringify(this.tableDates));
  const initialState = {
    backdrop: 'static'
  };
  this.bsModalRef = this.modalService.show(AddActivityBookingComponent,
    {
      class: 'modal-md modal-dialog-centered',
      initialState: {initialData}
    });
  this.bsModalRef.content.closeBtnName = 'Close';
}

bookActivity(initialData) {
  const BookingsItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
  if (BookingsItinerary) {
    // there are bookings in the itinerary already
    let campIDs: any[] = [];
    campIDs = campIDs.concat(BookingsItinerary.AccommodationBookings.filter(zz => zz.CampID !== initialData.CampID)
              .map(zz => zz.CampID));
    const added: any[] = campIDs.concat(BookingsItinerary.ActivityBookings.filter(zz => zz.CampID !== initialData.CampID)
                          .map(zz => zz.CampID));
    console.log(added);

    if (added.length !== 0) {
      this.mapLoader = true;
      const distanceRequest = {
        CurrentCampID: initialData.CampID,
        CompareCamps: added
      };

      this.serv.checkDistances(distanceRequest, this.global.GetServer()).subscribe(res => {
        if (res === false) {
          this.addActivityModal(initialData);
          this.mapLoader = false;
        } else {
          this.snack.open('You have booked at a camp that is 40KMs away from your other bookings. Unable to book here.', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      }, (error: HttpErrorResponse) => {
        this.mapLoader = false;
        this.snack.open('An Error occured on our servers, please try again.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
      });
    } else {
      this.addActivityModal(initialData);
    }
  } else {
    this.addActivityModal(initialData);
  }
}


  addAccommodationBookingModal(initialData): void {
    localStorage.setItem('Dates', JSON.stringify(initialData.Dates));
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddBookingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {initialData}
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    }

  bookWeek(bookingData, campID) { // For accommodation booking adding
    if (this.searchData.AccommodationChecked) {
      bookingData.campID = campID;
      bookingData.Dates = this.tableDates;
      bookingData.EndDate = this.boundaryDate;
      bookingData.StartDate = this.startDate;
      bookingData.BaseRate = null;

      console.log(bookingData);

      const BookingsItinerary: Booking = JSON.parse(localStorage.getItem('itinerary'));
      if (BookingsItinerary) {
        // there are bookings in the itinerary already
        let campIDs: any[] = [];
        campIDs = campIDs.concat(BookingsItinerary.AccommodationBookings.filter(zz => zz.CampID !== bookingData.campID)
                  .map(zz => zz.CampID));
        const added: any[] = campIDs.concat(BookingsItinerary.ActivityBookings.filter(zz => zz.CampID !== bookingData.campID)
                              .map(zz => zz.CampID));
        console.log(added);

        if (added.length !== 0) {
          this.mapLoader = true;
          const distanceRequest = {
            CurrentCampID: bookingData.campID,
            CompareCamps: added
          };

          this.serv.checkDistances(distanceRequest, this.global.GetServer()).subscribe(res => {
            if (res === false) {
              this.addAccommodationBookingModal(bookingData);
              this.mapLoader = false;
            } else {
              this.snack.open('You have booked at a camp that is 40KMs away from your other bookings. Unable to book here.', 'OK', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
              });
            }
          }, (error: HttpErrorResponse) => {
            this.mapLoader = false;
            console.log(error.message);
            this.snack.open('An Error occured on our servers, please try again.', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });
          });
        } else {
          this.addAccommodationBookingModal(bookingData);
        }
      } else {
        this.addAccommodationBookingModal(bookingData);
      }
    } else if (this.searchData.ActivityChecked) {

    } else if (this.searchData.DayVisitChecked) {

    }
  }
}
