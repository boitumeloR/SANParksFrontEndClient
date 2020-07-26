import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-child-dependent',
  templateUrl: './add-child-dependent.component.html',
  styleUrls: ['./add-child-dependent.component.scss']
})
export class AddChildDependentComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor() { }

  ngOnInit(): void {
  }

  confirm() {
    // do stuff
    this.close();
  }
  close() {
    this.bsModalRef.hide();
  }

}
