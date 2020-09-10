import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayWildcardComponent } from './pay-wildcard.component';

describe('PayWildcardComponent', () => {
  let component: PayWildcardComponent;
  let fixture: ComponentFixture<PayWildcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayWildcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayWildcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
