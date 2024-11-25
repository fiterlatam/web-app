import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumCreditRateHistoryComponent } from './maximum-credit-rate-history.component';

describe('MaximumCreditRateHistoryComponent', () => {
  let component: MaximumCreditRateHistoryComponent;
  let fixture: ComponentFixture<MaximumCreditRateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumCreditRateHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximumCreditRateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
