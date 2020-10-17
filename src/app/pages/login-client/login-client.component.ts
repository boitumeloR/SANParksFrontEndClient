import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SignUpComponent } from 'src/app/modals/sign-up/sign-up.component';
import { AuthService as Authenticate, Session} from 'src/app/services/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss']
})
export class LoginClientComponent implements OnInit {

  formGroup: FormGroup;
  private user: SocialUser;
  private loggedIn: boolean;
  bsModalRef: BsModalRef;
  loader = false;
  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService,
              private serv: Authenticate, private formBuilder: FormBuilder,
              private global: GlobalService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('googleUser', JSON.stringify(user));
      console.log(this.user);
      this.loggedIn = (user != null);
    });

    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
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

  Login() {
    if (this.formGroup.valid) {
      this.loader = true;
      const login: Session = {
        Username: this.formGroup.get('email').value,
        Password: this.formGroup.get('password').value,
        SessionID: null,
        SessionExpiry: null,
        UserSecret: null,
        Error: null,
        RoleID: null,
        isEmployee: false,
        isValidEmployee: false
      };

      this.serv.Login(login, this.global.GetServer()).subscribe(res => {
        if (!res.Error) {
          this.loader = false;
          sessionStorage.setItem('session', JSON.stringify(res));
          this.formGroup.reset();
          this.snack.open('Login success, you may now create or finalise your booking', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
          this.router.navigateByUrl('');
        } else {
          this.snack.open(res.Error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
          this.loader = false;
          this.formGroup.reset();
        }
      }, (error: HttpErrorResponse) => {
        this.loader = false;
        this.snack.open(`${error.message}. Try again later`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });

        this.formGroup.reset();
      });
    } else {
      // show snack
    }
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
