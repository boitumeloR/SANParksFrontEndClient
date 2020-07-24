import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChildDependentComponent } from './add-child-dependent.component';

describe('AddChildDependentComponent', () => {
  let component: AddChildDependentComponent;
  let fixture: ComponentFixture<AddChildDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChildDependentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
