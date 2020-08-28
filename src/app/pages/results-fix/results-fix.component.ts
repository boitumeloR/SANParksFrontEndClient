import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { ViewAvailableComponent } from 'src/app/modals/view-available/view-available.component';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';
import { AddActivityBookingComponent } from 'src/app/modals/add-activity-booking/add-activity-booking.component';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
{
    name: 'Berg - En - Dal Rest Camp',
    children: [
      {
        name: 'Bungalow CK6P',
        children: [
          {name: 'Broccoli'}
        ]
      }, {
        name: 'Chalet BP45',
        children: [
          {name: 'Pumpkins'}
        ]
      },
    ]
  },
];

@Component({
  selector: 'app-results-fix',
  templateUrl: './results-fix.component.html',
  styleUrls: ['./results-fix.component.scss']
})
export class ResultsFixComponent implements OnInit {
  bsModalRef: BsModalRef;
  isAccommodation = true;
  isActivity = true;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  // Calendar

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap',
    events: [
      {
        title: '12 Available',
        start: '2020-07-26',
        end: '2020-07-26'
      },
      {
        title: '12 Available',
        start: '2020-07-27',
        end: '2020-07-27'
      },
      {
        title: '12 Available',
        start: '2020-07-28',
        end: '2020-07-28'
      },
      {
        title: '12 Available',
        start: '2020-07-29',
        end: '2020-07-29'
      },
      {
        title: '12 Available',
        start: '2020-07-30',
        end: '2020-07-30'
      },
      {
        title: '12 Available',
        start: '2020-07-31',
        end: '2020-07-31'
      },
      {
        title: '12 Available',
        start: '2020-08-01',
        end: '2020-08-01'
      },
      {
        title: '12 Available',
        start: '2020-08-02',
        end: '2020-08-02'
      },
      {
        title: '12 Available',
        start: '2020-08-03',
        end: '2020-08-03'
      },
      {
        title: '12 Available',
        start: '2020-08-04',
        end: '2020-08-04'
      },
      {
        title: '12 Available',
        start: '2020-08-05',
        end: '2020-08-05'
      },
      {
        title: '12 Available',
        start: '2020-08-06',
        end: '2020-08-06'
      },
      {
        title: '12 Available',
        start: '2020-08-07',
        end: '2020-08-04'
      },
      {
        title: '12 Available',
        start: '2020-08-08',
        end: '2020-08-08'
      },
      {
        title: '12 Available',
        start: '2020-08-09',
        end: '2020-08-09'
      },
      {
        title: '8 Available',
        start: '2020-08-10',
        end: '2020-08-10'
      },
      {
        title: '12 Available',
        start: '2020-08-11',
        end: '2020-08-11'
      },
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.bsModalRef = this.modalService.show(AddBookingComponent, {
      class: 'modal-lg modal-dialog-centered'
    });
    /*
    console.log(selectInfo);
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }*/
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  constructor(private modalService: BsModalService) {
    this.dataSource.data = TREE_DATA;
   }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  toggleAccommodationCollapse() {
    this.isAccommodation = !this.isAccommodation;
  }

  ViewMore() {
    this.bsModalRef = this.modalService.show(ViewAvailableComponent, {
      class: 'modal-md modal-dialog-centered'
    });
  }
  toggleActivityCollapse() {
    this.isActivity = !this.isActivity;
  }

  // Calendar Functions

}
