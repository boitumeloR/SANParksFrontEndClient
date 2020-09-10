import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityBoxComponent } from './availability-box.component';

describe('AvailabilityBoxComponent', () => {
  let component: AvailabilityBoxComponent;
  let fixture: ComponentFixture<AvailabilityBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
