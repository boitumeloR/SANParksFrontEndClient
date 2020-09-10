import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WildcardPricingComponent } from './wildcard-pricing.component';

describe('WildcardPricingComponent', () => {
  let component: WildcardPricingComponent;
  let fixture: ComponentFixture<WildcardPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WildcardPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WildcardPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
