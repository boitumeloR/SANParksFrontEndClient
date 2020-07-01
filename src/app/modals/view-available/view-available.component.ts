import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddBookingComponent } from '../add-booking/add-booking.component';

@Component({
  selector: 'app-view-available',
  templateUrl: './view-available.component.html',
  styleUrls: ['./view-available.component.scss']
})
export class ViewAvailableComponent implements OnInit {

  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  addToItinerary(template: TemplateRef<any>) {
    this.modalService.show(template, {
      backdrop: 'static'
    });
  }

  close() {
    this.bsModalRef.hide();
  }

}
