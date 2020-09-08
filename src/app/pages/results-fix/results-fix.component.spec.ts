import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsFixComponent } from './results-fix.component';

describe('ResultsFixComponent', () => {
  let component: ResultsFixComponent;
  let fixture: ComponentFixture<ResultsFixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsFixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
