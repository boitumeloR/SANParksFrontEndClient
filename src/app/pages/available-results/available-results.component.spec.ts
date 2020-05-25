import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableResultsComponent } from './available-results.component';

describe('AvailableResultsComponent', () => {
  let component: AvailableResultsComponent;
  let fixture: ComponentFixture<AvailableResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
