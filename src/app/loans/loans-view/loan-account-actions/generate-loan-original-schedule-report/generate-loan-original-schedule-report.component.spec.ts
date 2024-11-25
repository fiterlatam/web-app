import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLoanOriginalScheduleReportComponent } from './generate-loan-original-schedule-report.component';

describe('GenerateLoanOriginalScheduleReportComponent', () => {
  let component: GenerateLoanOriginalScheduleReportComponent;
  let fixture: ComponentFixture<GenerateLoanOriginalScheduleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateLoanOriginalScheduleReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateLoanOriginalScheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
