import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-available-results',
  templateUrl: './available-results.component.html',
  styleUrls: ['./available-results.component.scss']
})
export class AvailableResultsComponent implements OnInit {

  isAccommodation = true;
  constructor() { }

  ngOnInit(): void {
  }

  toggleAccommodationCollapse() {
    this.isAccommodation = !this.isAccommodation;
  }

}
