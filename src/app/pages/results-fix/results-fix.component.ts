import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';

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
    const title = prompt('Please enter a new title for your event');
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
    }
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

  toggleActivityCollapse() {
    this.isActivity = !this.isActivity;
  }

  // Calendar Functions
}
