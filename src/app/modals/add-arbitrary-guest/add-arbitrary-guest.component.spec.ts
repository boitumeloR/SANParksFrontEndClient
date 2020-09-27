import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArbitraryGuestComponent } from './add-arbitrary-guest.component';

describe('AddArbitraryGuestComponent', () => {
  let component: AddArbitraryGuestComponent;
  let fixture: ComponentFixture<AddArbitraryGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArbitraryGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArbitraryGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
