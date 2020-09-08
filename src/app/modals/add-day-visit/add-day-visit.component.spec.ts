import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDayVisitComponent } from './add-day-visit.component';

describe('AddDayVisitComponent', () => {
  let component: AddDayVisitComponent;
  let fixture: ComponentFixture<AddDayVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDayVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDayVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
