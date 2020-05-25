import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss']
})
export class LoginClientComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('googleUser', JSON.stringify(user));
      console.log(this.user);
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      if (this.loggedIn) {
        localStorage.setItem('googleUser', JSON.stringify(user));
        this.router.navigateByUrl('');
      }
    });
  }

}
