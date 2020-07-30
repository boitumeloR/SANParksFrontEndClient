import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccommodationComponent } from './update-accommodation.component';

describe('UpdateAccommodationComponent', () => {
  let component: UpdateAccommodationComponent;
  let fixture: ComponentFixture<UpdateAccommodationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAccommodationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
