import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdultGuestComponent } from './update-adult-guest.component';

describe('UpdateAdultGuestComponent', () => {
  let component: UpdateAdultGuestComponent;
  let fixture: ComponentFixture<UpdateAdultGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAdultGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAdultGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
