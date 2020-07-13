import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddDependentsComponent } from 'src/app/modals/add-dependents/add-dependents.component';

@Component({
  selector: 'app-wildcard-family-option',
  templateUrl: './wildcard-family-option.component.html',
  styleUrls: ['./wildcard-family-option.component.scss']
})
export class WildcardFamilyOptionComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

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
}
