import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AvailabilityService } from 'src/app/services/available/availability.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddBookingComponent } from '../add-booking/add-booking.component';

@Component({
  selector: 'app-view-available',
  templateUrl: './view-available.component.html',
  styleUrls: ['./view-available.component.scss']
})
export class ViewAvailableComponent implements OnInit {

  accommodation: any;
  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef,
              private serv: AvailabilityService, private global: GlobalService) { }

  ngOnInit(): void {
    this.serv.GetAccommodationImage(this.accommodation.AccommodationTypeID, this.global.GetServer()).subscribe(res => {
      this.accommodation.Image = `data:image/png;base64,${res.Image}`;
      this.accommodation.Rate = res.Rate;
    });
  }

  close() {
    this.bsModalRef.hide();
  }

}
