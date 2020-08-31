import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SignUpComponent } from 'src/app/modals/sign-up/sign-up.component';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss']
})
export class LoginClientComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean;
  bsModalRef: BsModalRef;
  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService) { }

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

  SignUp(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(SignUpComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
