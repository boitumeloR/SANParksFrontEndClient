import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';
import { Booking } from 'src/app/services/booking/booking.service';
import { Session } from 'src/app/services/Auth/auth.service';
import {AuthService as Authenticate} from 'src/app/services/Auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  opened = false;
  googleUser: SocialUser;
  userOnline: Session;
  loggedIn = false;
  socialLogin = false;
  itineraryCount = 0;
  constructor(private authService: AuthService, private serv: Authenticate,
              private global: GlobalService, private snack: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    const bookings: Booking = JSON.parse(localStorage.getItem('itinerary'));
    if (bookings) {
      this.itineraryCount += bookings.AccommodationBookings.length;
      this.itineraryCount += bookings.ActivityBookings.length;
      this.itineraryCount += bookings.DayVisits.length;
    }
    this.opened = false;
    this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
    this.userOnline = JSON.parse(sessionStorage.getItem('session'));
    if (this.googleUser) {
      this.socialLogin = true;
    }
    if (this.userOnline) {
      this.loggedIn = true;
    }
    console.log(this.loggedIn);
    console.log(this.userOnline);
  }

  toggleBurger() {
    this.opened = !this.opened;
  }

  Logout()  {
  const  sess: Session = JSON.parse(sessionStorage.getItem('session'));
  this.serv.LogOut(sess, this.global.GetServer()).subscribe(res => {
    if (!res.Error) {
      sessionStorage.removeItem('session');
      this.router.navigate(['']);
    } else {
      this.snack.open(res.Error, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
    }
  }, (error: HttpErrorResponse) => {
    this.snack.open(error.message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000
    });
  });
  }

  signOut() {
    this.authService.signOut();
    localStorage.removeItem('googleUser');
    location.reload();
  }
}
