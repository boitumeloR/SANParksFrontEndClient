import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';
import { Booking } from 'src/app/services/booking/booking.service';
import { Session } from 'src/app/services/Auth/auth.service';
import {AuthService as Authenticate} from 'src/app/services/Auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router , NavigationEnd } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  currentRoute: string;
  opened = false;
  googleUser: SocialUser;
  userOnline: Session;
  loggedIn = false;
  socialLogin = false;
  itineraryCount = 0;


  bookings: any = {};
  constructor(private authService: AuthService, private serv: Authenticate,
              private global: GlobalService, private snack: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
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

  ngAfterViewInit() {
    this.bookings = JSON.parse(localStorage.getItem('itinerary'));
    this.itineraryCount += this.bookings.AccommodationBookings.length;
    this.itineraryCount += this.bookings.ActivityBookings.length;
    this.itineraryCount += this.bookings.DayVisits.length;
  }

  toggleBurger() {
    this.opened = !this.opened;
  }

  Logout()  {
  const  sess: Session = JSON.parse(sessionStorage.getItem('session'));
  this.serv.LogOut(sess, this.global.GetServer()).subscribe(res => {
    if (!res.Error) {
      sessionStorage.removeItem('session');
      if (this.currentRoute === '/Home') {
        location.reload();
      } else if (this.currentRoute === '/') {
        location.reload();
      } else {
        this.router.navigateByUrl('');
      }
    } else {
      sessionStorage.removeItem('session');
      this.router.navigateByUrl('');
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
