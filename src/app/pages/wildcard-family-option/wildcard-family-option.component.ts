import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddDependentsComponent } from 'src/app/modals/add-dependents/add-dependents.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wildcard-family-option',
  templateUrl: './wildcard-family-option.component.html',
  styleUrls: ['./wildcard-family-option.component.scss']
})
export class WildcardFamilyOptionComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private router: Router) { }

  ngOnInit(): void {
  }

  addDependentsModal(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddDependentsComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  FirstOption() {
    localStorage.setItem('dependents', JSON.stringify({children: 5, adults: 2}));
    this.router.navigateByUrl('Dependents');
  }

  SecondOption() {
    localStorage.setItem('dependents', JSON.stringify({children: 6, adults: 1}));
    this.router.navigateByUrl('Dependents');
  }
}
