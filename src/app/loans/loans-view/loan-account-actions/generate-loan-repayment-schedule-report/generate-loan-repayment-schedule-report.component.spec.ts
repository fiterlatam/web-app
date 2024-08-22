import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLoanRepaymentScheduleReportComponent } from './generate-loan-repayment-schedule-report.component';

describe('GenerateLoanRepaymentScheduleReportComponent', () => {
  let component: GenerateLoanRepaymentScheduleReportComponent;
  let fixture: ComponentFixture<GenerateLoanRepaymentScheduleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateLoanRepaymentScheduleReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateLoanRepaymentScheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
