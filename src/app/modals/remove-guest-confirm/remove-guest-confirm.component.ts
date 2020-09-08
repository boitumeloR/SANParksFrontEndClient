import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-remove-guest-confirm',
  templateUrl: './remove-guest-confirm.component.html',
  styleUrls: ['./remove-guest-confirm.component.scss']
})
export class RemoveGuestConfirmComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef) { }

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
