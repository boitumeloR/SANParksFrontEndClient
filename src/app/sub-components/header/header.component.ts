import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';
import { Booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  opened = false;
  googleUser: SocialUser;
  loggedIn = false;
  itineraryCount = 0;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const bookings: Booking = JSON.parse(localStorage.getItem('itinerary'));
    if (bookings) {
      this.itineraryCount += bookings.AccommodationBookings.length;
      this.itineraryCount += bookings.ActivityBookings.length;
      this.itineraryCount += bookings.DayVisits.length;
    }
    this.opened = false;
    this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
    if (this.googleUser) {
      this.loggedIn = true;
    }
    console.log(this.loggedIn);
    console.log(this.googleUser);
  }

  toggleBurger() {
    this.opened = !this.opened;
  }

  signOut() {
    this.authService.signOut();
    localStorage.removeItem('googleUser');
    location.reload();
  }
}
