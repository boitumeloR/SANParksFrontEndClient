import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChildGuestComponent } from './update-child-guest.component';

describe('UpdateChildGuestComponent', () => {
  let component: UpdateChildGuestComponent;
  let fixture: ComponentFixture<UpdateChildGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateChildGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateChildGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
