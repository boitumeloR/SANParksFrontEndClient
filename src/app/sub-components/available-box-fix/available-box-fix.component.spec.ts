import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBoxFixComponent } from './available-box-fix.component';

describe('AvailableBoxFixComponent', () => {
  let component: AvailableBoxFixComponent;
  let fixture: ComponentFixture<AvailableBoxFixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableBoxFixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableBoxFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
