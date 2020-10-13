import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/services/global/global.service';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-available-box-fix',
  templateUrl: './available-box-fix.component.html',
  styleUrls: ['./available-box-fix.component.scss']
})
export class AvailableBoxFixComponent implements OnInit {
  isAccommodation = true;
  isActivity = true;

  loader = false;
  availableGroup: FormGroup;
  checks = 0;
  // Errors
  httpError = false;
  httpMessage = '';
  // Dropdown content
  parks: any[];
  camps: any[];
  activityTypes: any[];
  accommodationTypes: any[];

  // Observables
  dropDowns$: Observable<any>;
  parkDrop$: Observable<any>;
  activityDrop$: Observable<any>;
  accommodationDrop$: Observable<any>;
  dayDrop$: Observable<any>;
  checkAvailability$: Observable<any>;

  constructor(private router: Router, private formBuilder: FormBuilder, private global: GlobalService,
              private serv: AvailabilityService) { }

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
      if (this.availableGroup.get('activity').value === true) {
        const values = {
          parkID: this.availableGroup.get('park').value,
          campID: this.availableGroup.get('camp').value
        };

        this.availableGroup.get('accommodation').reset();
        this.availableGroup.get('day').reset();
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

        this.availableGroup.get('activity').reset();
        this.availableGroup.get('day').reset();
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
    }
  }

  onChooseDay() {
    if (this.availableGroup.valid) {
      this.availableGroup.get('activity').reset();
      this.availableGroup.get('accommodation').reset();

      this.isActivity = true;
      this.isAccommodation = true;
      this.checks++;
    }
    else {
      this.httpError = true;
      this.httpMessage = 'Make Sure to choose a park before submiting';
    }
  }

  CheckAvailability() {
    if (this.availableGroup.valid) {
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
        BaseDate: new Date()
      };

      console.log(availableData);

      this.checkAvailability$ = this.serv.checkAvailability(availableData, this.global.GetServer());
      this.checkAvailability$.subscribe(res => {
        this.loader = false;
        localStorage.setItem('availableResults', JSON.stringify(res));
        localStorage.setItem('searchData', JSON.stringify(availableData));
        this.router.navigate(['availableResults']);
      }, (error: HttpErrorResponse) => {
        this.httpError = true;
        this.httpMessage = error.message;
      });
      console.log(availableData);
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
}
