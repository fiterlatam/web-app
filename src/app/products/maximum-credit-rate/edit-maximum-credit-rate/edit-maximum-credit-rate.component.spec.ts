import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaximumCreditRateComponent } from './edit-maximum-credit-rate.component';

describe('EditMaximumCreditRateComponent', () => {
  let component: EditMaximumCreditRateComponent;
  let fixture: ComponentFixture<EditMaximumCreditRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMaximumCreditRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaximumCreditRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
