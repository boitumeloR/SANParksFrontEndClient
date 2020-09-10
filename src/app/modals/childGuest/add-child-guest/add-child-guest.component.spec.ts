import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChildGuestComponent } from './add-child-guest.component';

describe('AddChildGuestComponent', () => {
  let component: AddChildGuestComponent;
  let fixture: ComponentFixture<AddChildGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChildGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
