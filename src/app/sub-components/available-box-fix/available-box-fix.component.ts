import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-box-fix',
  templateUrl: './available-box-fix.component.html',
  styleUrls: ['./available-box-fix.component.scss']
})
export class AvailableBoxFixComponent implements OnInit {
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