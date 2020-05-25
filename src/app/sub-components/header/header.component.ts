import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  opened = false;
  googleUser: SocialUser;
  loggedIn = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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
