import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTransactionGeneralTabComponent } from './loan-transaction-general-tab.component';

describe('LoanTransactionGeneralTabComponent', () => {
  let component: LoanTransactionGeneralTabComponent;
  let fixture: ComponentFixture<LoanTransactionGeneralTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTransactionGeneralTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanTransactionGeneralTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
