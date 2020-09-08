import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWildcardDetailsComponent } from './view-wildcard-details.component';

describe('ViewWildcardDetailsComponent', () => {
  let component: ViewWildcardDetailsComponent;
  let fixture: ComponentFixture<ViewWildcardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWildcardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWildcardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
