import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { WildcardService, Category, Wildcard } from 'src/app/services/Wildcard/wildcard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginModalComponent } from 'src/app/modals/login-modal/login-modal.component';
import { BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-wildcard-pricing',
  templateUrl: './wildcard-pricing.component.html',
  styleUrls: ['./wildcard-pricing.component.scss']
})
export class WildcardPricingComponent implements OnInit {

  Categories: Category[];
  selectedCluster: number;
  rate: number;
  loginRef: BsModalRef;
  constructor(private router: Router, private snack: MatSnackBar, private global: GlobalService,
              private serv: WildcardService, private modalService: BsModalService,
              private bookServ: BookingService) { }

  ngOnInit(): void {
    this.serv.getCategories(this.global.GetServer()).subscribe(res => {
      this.Categories = res.Categories;
      console.log(this.Categories);
    }, (error: HttpErrorResponse) => {
      const s = this.snack.open('An error occured on our servers, try again later', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
      s.afterDismissed().subscribe(() => this.router.navigateByUrl(''));
    });
  }

  MakePurchase(category: Category) {
    const WC: Wildcard = {
      WildcardID: null,
      CategoryID: category.WildcardCategoryID,
      ClusterID: this.selectedCluster,
      ClientID: null,
      Dependents: null,
      paymentToken: null,
      Session: null,
      Amount: category.DefaultRate
    };
    localStorage.setItem('wildcard', JSON.stringify(WC));

    if (category.WilcardCategoryName === 'Individual') {
      const sess = JSON.parse(sessionStorage.getItem('session'));

      if (sess) {
        this.bookServ.getClientFromSession(sess, this.global.GetServer()).subscribe(result => {
          if (!result.Session.Error) {
            console.log(result);
            WC.ClientID = result.ClientID;
            sessionStorage.setItem('session', JSON.stringify(result.Session));
            localStorage.setItem('wildcard', JSON.stringify(WC));
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
        this.loginRef.content.closeBtnName = 'Close';

        this.loginRef.content.event.subscribe(res => {
          if (res.result === true) {
            const session = JSON.parse(sessionStorage.getItem('session'));
            this.bookServ.getClientFromSession(session, this.global.GetServer()).subscribe(result => {
              if (!result.Session.Error) {
                console.log(result);
                WC.ClientID = result.ClientID;
                sessionStorage.setItem('session', JSON.stringify(result.Session));
                localStorage.setItem('wildcard', JSON.stringify(WC));
                this.router.navigateByUrl('wildcardPayment');
              } else {
                const sb = this.snack.open(result.Session.Error, 'OK', {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 5000
                });
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
    } else if (category.WilcardCategoryName === 'Couple') {
      localStorage.setItem('dependents', JSON.stringify({children: 0, adults: 1}));
      this.router.navigate(['Dependents']);
    } else if (category.WilcardCategoryName === 'Family') {
      this.router.navigate(['wildcardFamily']);
    }
  }
  ChangeAmount(category: Category) {
    const obj = {
      ClusterID: this.selectedCluster,
      CategoryID: category.WildcardCategoryID
    };

    this.serv.getAmount(this.global.GetServer(), obj).subscribe(res => {
      this.Categories.find(cat => cat === category).DefaultRate = res;
    }, (error: HttpErrorResponse) => {
      this.snack.open(error.message, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
    });
  }
}
