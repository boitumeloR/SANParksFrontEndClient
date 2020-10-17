import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccommodationBookingComponent } from './update-accommodation-booking.component';

describe('UpdateAccommodationBookingComponent', () => {
  let component: UpdateAccommodationBookingComponent;
  let fixture: ComponentFixture<UpdateAccommodationBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAccommodationBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccommodationBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
