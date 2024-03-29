import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability-box',
  templateUrl: './availability-box.component.html',
  styleUrls: ['./availability-box.component.scss']
})
export class AvailabilityBoxComponent implements OnInit {

  isAccommodation = true;
  isActivity = true;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  CheckAvailability() {
    this.router.navigateByUrl('availableResults');
  }

  toggleAccommodationCollapse() {
    this.isAccommodation = !this.isAccommodation;
  }

  toggleActivityCollapse() {
    this.isActivity = !this.isActivity;
  }
}
