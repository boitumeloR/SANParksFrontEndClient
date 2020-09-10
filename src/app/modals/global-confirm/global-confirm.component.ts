import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-global-confirm',
  templateUrl: './global-confirm.component.html',
  styleUrls: ['./global-confirm.component.scss']
})
export class GlobalConfirmComponent implements OnInit {

  confirmationMessage: string;
  data: any;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.confirmationMessage = this.data.message;
    console.log(this.confirmationMessage);
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
