import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'src/app/services/global/global.service';
import { WildcardService, Category, Wildcard } from 'src/app/services/Wildcard/wildcard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wildcard-pricing',
  templateUrl: './wildcard-pricing.component.html',
  styleUrls: ['./wildcard-pricing.component.scss']
})
export class WildcardPricingComponent implements OnInit {

  Categories: Category[];
  selectedCluster: number;
  rate: number;
  constructor(private router: Router, private snack: MatSnackBar, private global: GlobalService,
              private serv: WildcardService) { }

  ngOnInit(): void {
    this.serv.getCategories(this.global.GetServer()).subscribe(res => {
      this.Categories = res;
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
      Amount: category.DefaultRate
    };
    localStorage.setItem('wildcard', JSON.stringify(WC));

    if (category.WilcardCategoryName === 'Individual') {
      this.router.navigate(['payWildcard']);
    } else if (category.WilcardCategoryName === 'Couple') {
      localStorage.setItem('dependents', JSON.stringify({children: 0, adults: 1}));
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
