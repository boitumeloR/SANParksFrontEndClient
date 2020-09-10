import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosestGateComponent } from './closest-gate.component';

describe('ClosestGateComponent', () => {
  let component: ClosestGateComponent;
  let fixture: ComponentFixture<ClosestGateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosestGateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosestGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
