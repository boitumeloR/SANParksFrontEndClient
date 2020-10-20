import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SignUpComponent } from 'src/app/modals/sign-up/sign-up.component';
import { AuthService as Authenticate, Session} from 'src/app/services/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { SuccessModalComponent } from 'src/app/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-external-reset',
  templateUrl: './external-reset.component.html',
  styleUrls: ['./external-reset.component.scss']
})
export class ExternalResetComponent implements OnInit {
  formGroup: FormGroup;
  private loggedIn: boolean;
  bsModalRef: BsModalRef;
  loader = false;
  observe$: any;
  clientID: number;
  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService,
              private serv: Authenticate, private formBuilder: FormBuilder,
              private global: GlobalService, private snack: MatSnackBar,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      confirm: ['', Validators.compose([Validators.required])]
    });

    this.observe$ = this.route.params.subscribe(parameter => {
      // tslint:disable-next-line: no-string-literal
      this.clientID = Number(parameter['id']);
      console.log(parameter['id']);
    });
  }

  ResetPassword() {
    if ( this.formGroup.get('password').value === this.formGroup.get('confirm').value ) {

      const pass = {
        ClientID: this.clientID,
        Password: this.formGroup.get('password').value
      };
      this.serv.ResetPassword(this.global.GetServer(), pass).subscribe(res => {
        if (res.Success) {
          this.modalService.show(SuccessModalComponent, {
            class: 'modal-md modal-dialog-centered',
            initialState: {successMessage: 'You Have Successfully Updated Your Password'}
          });

          this.router.navigateByUrl('Login');
        } else {
          if (res.Found === false) {
            this.snack.open('A user from your email origin was not found on our system.', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 2000
            });
          } else {
            this.snack.open('Unknown error occured, try again', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 2000
            });
          }
        }
      });
    } else {
      this.snack.open('Make sure your passwords match!', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000
      });
    }
  }

}
