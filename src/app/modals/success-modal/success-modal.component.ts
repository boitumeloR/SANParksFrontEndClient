import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {

  successMessage: string;
  data: any;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    console.log(this.successMessage);
  }

  close() {
    // do stuff
    this.event.emit({data: false});
    this.bsModalRef.hide();
  }

  confirm() {
    this.event.emit({data: true});
    this.bsModalRef.hide();
  }
}
