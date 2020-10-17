import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalWildcardPaymentComponent } from './external-wildcard-payment.component';

describe('ExternalWildcardPaymentComponent', () => {
  let component: ExternalWildcardPaymentComponent;
  let fixture: ComponentFixture<ExternalWildcardPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalWildcardPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalWildcardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
