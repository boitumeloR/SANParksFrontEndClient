import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewWildcardComponent } from './renew-wildcard.component';

describe('RenewWildcardComponent', () => {
  let component: RenewWildcardComponent;
  let fixture: ComponentFixture<RenewWildcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewWildcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewWildcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
