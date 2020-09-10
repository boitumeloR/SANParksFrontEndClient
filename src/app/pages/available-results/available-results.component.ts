import { Component, OnInit } from '@angular/core';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewAvailableComponent } from 'src/app/modals/view-available/view-available.component';
import { config } from 'process';
import { ViewAvailableImgComponent } from 'src/app/modals/view-available-img/view-available-img.component';
import { AddBookingComponent } from 'src/app/modals/add-booking/add-booking.component';

@Component({
  selector: 'app-available-results',
  templateUrl: './available-results.component.html',
  styleUrls: ['./available-results.component.scss']
})
export class AvailableResultsComponent implements OnInit {

  bsModalRef: BsModalRef;
  isAccommodation = true;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  showImagesModal(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewAvailableImgComponent,
      {
        class: 'modal-lg modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  addBookingModal(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(AddBookingComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  viewMoreModal(): void {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(ViewAvailableComponent,
      {
        class: 'modal-md modal-dialog-centered'
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  toggleAccommodationCollapse() {
    this.isAccommodation = !this.isAccommodation;
  }

}
