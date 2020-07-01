import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAvailableImgComponent } from './view-available-img.component';

describe('ViewAvailableImgComponent', () => {
  let component: ViewAvailableImgComponent;
  let fixture: ComponentFixture<ViewAvailableImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAvailableImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAvailableImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
