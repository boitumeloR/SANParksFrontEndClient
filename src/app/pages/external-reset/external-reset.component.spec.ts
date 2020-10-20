import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalResetComponent } from './external-reset.component';

describe('ExternalResetComponent', () => {
  let component: ExternalResetComponent;
  let fixture: ComponentFixture<ExternalResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
