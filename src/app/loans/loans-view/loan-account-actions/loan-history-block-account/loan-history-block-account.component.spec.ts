import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanHistoryBlockAccountComponent } from './loan-history-block-account.component';

describe('LoanHistoryBlockAccountComponent', () => {
  let component: LoanHistoryBlockAccountComponent;
  let fixture: ComponentFixture<LoanHistoryBlockAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanHistoryBlockAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanHistoryBlockAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
