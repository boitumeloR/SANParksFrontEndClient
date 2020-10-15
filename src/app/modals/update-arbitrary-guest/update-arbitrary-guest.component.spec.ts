import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArbitraryGuestComponent } from './update-arbitrary-guest.component';

describe('UpdateArbitraryGuestComponent', () => {
  let component: UpdateArbitraryGuestComponent;
  let fixture: ComponentFixture<UpdateArbitraryGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateArbitraryGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateArbitraryGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
