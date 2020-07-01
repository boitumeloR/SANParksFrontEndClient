import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveGuestConfirmComponent } from './remove-guest-confirm.component';

describe('RemoveGuestConfirmComponent', () => {
  let component: RemoveGuestConfirmComponent;
  let fixture: ComponentFixture<RemoveGuestConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveGuestConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveGuestConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
