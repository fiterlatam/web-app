import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSheduleReportComponent } from './generate-shedule-report.component';

describe('GenerateSheduleReportComponent', () => {
  let component: GenerateSheduleReportComponent;
  let fixture: ComponentFixture<GenerateSheduleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateSheduleReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
