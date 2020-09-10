import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddDependentsComponent } from 'src/app/modals/add-dependents/add-dependents.component';
import { AddChildDependentComponent } from 'src/app/modals/add-child-dependent/add-child-dependent.component';
import { Dependent, Wildcard, WildcardService } from 'src/app/services/Wildcard/wildcard.service';
import { LoginModalComponent } from 'src/app/modals/login-modal/login-modal.component';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.scss']
})
export class DependentsComponent implements OnInit {

  bsModalRef: BsModalRef;
  loginRef: BsModalRef;
  constructor(private modalService: BsModalService, private serv: BookingService,
              private global: GlobalService, private router: Router, private snack: MatSnackBar) { }

  childLimit: number;
  adultLimit: number;
  Dependents: Dependent[];
  ngOnInit(): void {
    const obj = JSON.parse(localStorage.getItem('dependents'));
    this.childLimit = obj.children;
    this.adultLimit = obj.adults;
  }

  AddAdult(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddDependentsComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      this.Dependents.push(res);
      this.adultLimit--;
    });
  }

  AddChild(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddChildDependentComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(res => {
      this.Dependents.push(res);
      this.childLimit--;
    });
  }

  PayWildcard() {
    const wildcard: Wildcard = JSON.parse(localStorage.getItem('wildcard'));

    wildcard.Dependents = this.Dependents;

    const sess = JSON.parse(sessionStorage.getItem('session'));

    if (sess) {
      this.serv.getClientFromSession(sess, this.global.GetServer()).subscribe(result => {
        if (!result.Session.Error && result.ClientID !== 0) {
          wildcard.ClientID = result.ClientID;
          sessionStorage.setItem('session', JSON.stringify(result.Session));
          localStorage.setItem('wildcard', JSON.stringify(wildcard));
          this.router.navigateByUrl('wildcardPayment');
        } else {
          this.router.navigate(['Login']);
        }
      }, (error: HttpErrorResponse) => {
        const sb = this.snack.open('An error occured on our servers, try again later.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
        sb.afterDismissed().subscribe(() => this.router.navigateByUrl(''));
      });
    } else {
      this.loginRef = this.modalService.show(LoginModalComponent,
        {
          class: 'modal-md modal-dialog-centered',
          backdrop: 'static',
          initialState: {
            data: {
            message: 'Are you sure you want to remove this guest?'
            }
          }
        });

      this.loginRef.content.event.subscribe(res => {
        if (res.result === true) {
          const session = JSON.parse(sessionStorage.getItem('session'));
          this.serv.getClientFromSession(session, this.global.GetServer()).subscribe(result => {
            if (!result.Session.Error) {
              wildcard.ClientID = result.ClientID;
              sessionStorage.setItem('session', JSON.stringify(result.Session));
              localStorage.setItem('wildcard', JSON.stringify(wildcard));
              this.router.navigateByUrl('wildcardPayment');
            } else {
              this.router.navigate(['Login']);
            }
          }, (error: HttpErrorResponse) => {
            const sb = this.snack.open('An error occured on our servers, try again later.', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000
            });
            sb.afterDismissed().subscribe(() => this.router.navigateByUrl(''));
          });
        } else {
          this.router.navigateByUrl('Login');
        }
      });
    }
  }
}
