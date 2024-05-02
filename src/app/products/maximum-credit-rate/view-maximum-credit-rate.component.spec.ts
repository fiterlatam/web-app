import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaximumCreditRateComponent } from './view-maximum-credit-rate.component';

describe('ViewMaximumCreditRateComponent', () => {
  let component: ViewMaximumCreditRateComponent;
  let fixture: ComponentFixture<ViewMaximumCreditRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMaximumCreditRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaximumCreditRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
