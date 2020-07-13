import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WildcardFamilyOptionComponent } from './wildcard-family-option.component';

describe('WildcardFamilyOptionComponent', () => {
  let component: WildcardFamilyOptionComponent;
  let fixture: ComponentFixture<WildcardFamilyOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WildcardFamilyOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WildcardFamilyOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
