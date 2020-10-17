import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-wildcard-details',
  templateUrl: './view-wildcard-details.component.html',
  styleUrls: ['./view-wildcard-details.component.scss']
})
export class ViewWildcardDetailsComponent implements OnInit {


  wildcard: any;
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }


  close() {
    this.bsModalRef.hide();
  }


}
