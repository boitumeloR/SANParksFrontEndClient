import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityBookingComponent } from './add-activity-booking.component';

describe('AddActivityBookingComponent', () => {
  let component: AddActivityBookingComponent;
  let fixture: ComponentFixture<AddActivityBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
