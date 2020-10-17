import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalBookingPaymentComponent } from './external-booking-payment.component';

describe('ExternalBookingPaymentComponent', () => {
  let component: ExternalBookingPaymentComponent;
  let fixture: ComponentFixture<ExternalBookingPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalBookingPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalBookingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
