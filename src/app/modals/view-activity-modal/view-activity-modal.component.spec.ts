import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActivityModalComponent } from './view-activity-modal.component';

describe('ViewActivityModalComponent', () => {
  let component: ViewActivityModalComponent;
  let fixture: ComponentFixture<ViewActivityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActivityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
