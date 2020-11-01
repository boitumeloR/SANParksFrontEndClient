import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPaymentComponent } from './last-payment.component';

describe('LastPaymentComponent', () => {
  let component: LastPaymentComponent;
  let fixture: ComponentFixture<LastPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
