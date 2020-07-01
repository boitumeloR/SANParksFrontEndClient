import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-available-img',
  templateUrl: './view-available-img.component.html',
  styleUrls: ['./view-available-img.component.scss']
})
export class ViewAvailableImgComponent implements OnInit {

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
