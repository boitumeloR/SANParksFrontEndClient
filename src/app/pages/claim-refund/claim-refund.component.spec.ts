import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRefundComponent } from './claim-refund.component';

describe('ClaimRefundComponent', () => {
  let component: ClaimRefundComponent;
  let fixture: ComponentFixture<ClaimRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
