import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAvailableComponent } from './view-available.component';

describe('ViewAvailableComponent', () => {
  let component: ViewAvailableComponent;
  let fixture: ComponentFixture<ViewAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
