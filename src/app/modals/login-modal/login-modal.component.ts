import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialUser, AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService as Authenticate, Session} from 'src/app/services/Auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  httpError = false;
  httpMessage = '';
  myGroup: FormGroup;
  private user: SocialUser;
  private loggedIn: boolean;
  loader = false;
  public event: EventEmitter<any> = new EventEmitter<any>();
  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService,
              private serv: Authenticate, private formBuilder: FormBuilder,
              private global: GlobalService, private snack: MatSnackBar,  private loginRef: BsModalRef) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('googleUser', JSON.stringify(user));
      console.log(this.user);
      this.loggedIn = (user != null);
    });

    this.myGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  resetHttp() {
    this.httpError = false;
    this.httpMessage = '';
  }
  close() {
    this.event.emit({result: false});
    this.loginRef.hide();
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      if (this.loggedIn) {
        localStorage.setItem('googleUser', JSON.stringify(user));
        this.router.navigateByUrl('');
      }
    });
  }

  Login() {
    if (this.myGroup.valid) {
      this.loader = true;
      const login: Session = {
        Username: this.myGroup.get('email').value,
        Password: this.myGroup.get('password').value,
        SessionID: null,
        SessionExpiry: null,
        UserSecret: null,
        Error: null,
        RoleID: null
      };

      this.serv.Login(login, this.global.GetServer()).subscribe(res => {
        if (!res.Error) {
          this.loader = false;
          sessionStorage.setItem('session', JSON.stringify(res));
          this.event.emit({result: true});
          this.loginRef.hide();
          this.myGroup.reset();
        } else {
          this.httpError = true;
          this.httpMessage = res.Error;
          this.loader = false;
        }
      }, (error: HttpErrorResponse) => {
        this.loader = false;
        this.httpError = true;
        this.httpMessage = error.message;
        this.myGroup.reset();
      });
    } else {
      this.httpError = true;
      this.httpMessage = 'Enter the correct text types!';
    }
  }
}
