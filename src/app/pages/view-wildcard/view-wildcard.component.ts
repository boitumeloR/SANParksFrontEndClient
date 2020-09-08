import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ViewWildcardDetailsComponent } from 'src/app/modals/view-wildcard-details/view-wildcard-details.component';

@Component({
  selector: 'app-view-wildcard',
  templateUrl: './view-wildcard.component.html',
  styleUrls: ['./view-wildcard.component.scss']
})
export class ViewWildcardComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  viewWildcardDetailsModal(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewWildcardDetailsComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
