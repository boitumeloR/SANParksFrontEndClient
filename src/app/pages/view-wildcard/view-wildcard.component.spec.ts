import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWildcardComponent } from './view-wildcard.component';

describe('ViewWildcardComponent', () => {
  let component: ViewWildcardComponent;
  let fixture: ComponentFixture<ViewWildcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWildcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWildcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
