import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GlobalConfirmComponent } from 'src/app/modals/global-confirm/global-confirm.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-renew-wildcard',
  templateUrl: './renew-wildcard.component.html',
  styleUrls: ['./renew-wildcard.component.scss']
})
export class RenewWildcardComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService,
              private router: Router,
              private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  Confirm(): void {
    const initialState = {
    };
    localStorage.setItem('confirm', 'Are you sure you would like to proceed to payment');
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-sm modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          data: {message: 'Are you sure you would like to proceed to payment'}
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        this.router.navigateByUrl('wildcardPayment');
        this.openSnackBar();
      }
    });
  }

  Cancel() {
    const initialState = {
    };
    this.bsModalRef = this.modalService.show(GlobalConfirmComponent,
      {
        class: 'modal-sm modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          data: {message: 'Are you sure you would like to cancel the renewal?'}
        }
      });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      if (res.data) {
        this.router.navigateByUrl('viewWildcard');
      }
    });
  }

  openSnackBar() {
    this.snackBar.open('Successful wildcard renewal', 'Okay', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
