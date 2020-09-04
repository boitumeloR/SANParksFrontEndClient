import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TableDate, AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';

@Component({
  selector: 'app-table-results',
  templateUrl: './table-results.component.html',
  styleUrls: ['./table-results.component.scss']
})
export class TableResultsComponent implements OnInit {


  // Observables
  checkAvailability$: Observable<any>;

  tableDates: TableDate[];
  availableResults: any;
  apiData: any;
  searchData: any;
  parkName: string;
  datePicked: Date;
  startDate = new Date();
  placeDate = new Date();
  boundaryDate: Date = new Date(this.placeDate.setMonth(this.placeDate.getMonth() + 11));
  head = 'head';
  loader = false;
  httpError = false;
  httpMessage = '';
  isOpen = true;
  bsModalRef: BsModalRef;
  constructor(private router: Router, private serv: AvailabilityService,
              private global: GlobalService, private snack: MatSnackBar,
              private modalService: BsModalService) { }
  ngOnInit(): void {
    this.apiData = JSON.parse(localStorage.getItem('availableResults'));
    this.searchData = JSON.parse(localStorage.getItem('searchData'));
    this.availableResults = this.apiData.AvailableResults;
    console.log(this.availableResults);
    this.tableDates = this.apiData.Dates;
    this.parkName = this.apiData.ParkName;

    console.log(this.tableDates);
  }

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


  addAccommodationBookingModal(bookingData): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddBookingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: bookingData
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    }

  bookWeek(bookingData, campID) {
    if (this.searchData.AccommodationChecked) {
      bookingData.campID = campID;
      bookingData.Dates = this.tableDates;
      bookingData.EndDate = this.boundaryDate;
      bookingData.StartDate = this.startDate;
      console.log(bookingData);

      this.addAccommodationBookingModal(bookingData);


    } else if (this.searchData.ActivityChecked) {

    } else if (this.searchData.DayVisitChecked) {

    }
  }
}
