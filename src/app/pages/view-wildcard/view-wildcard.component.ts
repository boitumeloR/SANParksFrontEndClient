import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ViewWildcardDetailsComponent } from 'src/app/modals/view-wildcard-details/view-wildcard-details.component';
import { Wildcard, WildcardService } from 'src/app/services/Wildcard/wildcard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-wildcard',
  templateUrl: './view-wildcard.component.html',
  styleUrls: ['./view-wildcard.component.scss']
})
export class ViewWildcardComponent implements OnInit {

  bsModalRef: BsModalRef;
  Wildcards: any[] = [];
  constructor(private modalService: BsModalService, private serv: WildcardService,
              private snack: MatSnackBar, private router: Router,
              private global: GlobalService) { }

  ngOnInit(): void {
    const sess = JSON.parse(sessionStorage.getItem('session'));
    this.serv.SearchWildcard(sess, this.global.GetServer()).subscribe(res => {
      if (res.Success) {
        console.log(res);
        this.Wildcards = res.Wildcards;
        sessionStorage.setItem('session', JSON.parse(res.Session));
      } else {
        if (res.Session.Error) {
          this.snack.open(res.Session.Error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
          this.router.navigate(['Login']);
        }
      }
    }, (error: HttpErrorResponse) => {
      this.snack.open(error.message, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
      this.router.navigate(['']);
    });
  }

  viewWildcardDetailsModal(wildcard): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewWildcardDetailsComponent,
      {
        class: 'modal-md modal-dialog-centered',
        initialState: wildcard
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  RenewWildcard(wildcard) {
    const obj: Wildcard = {
      WildcardID: wildcard.WildcardID,
      CategoryID: wildcard.CategoryID,
      ClusterID: wildcard.ClusterID,
      ClientID: wildcard.ClientID,
      Amount: null,
      Session: null,
      Dependents: null,
      paymentToken: null
    };

    this.serv.getAmount(this.global.GetServer(), obj).subscribe(res => {
      obj.Amount = res;
    });

    localStorage.setItem('wildcard', JSON.stringify(obj));
    localStorage.setItem('update', JSON.stringify({Update: true}));
    this.router.navigateByUrl('wildcardPayment');
  }
}
