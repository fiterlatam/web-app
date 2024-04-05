import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDisbursementReportComponent } from './generate-disbursement-report.component';

describe('GenerateDisbursementReportComponent', () => {
  let component: GenerateDisbursementReportComponent;
  let fixture: ComponentFixture<GenerateDisbursementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateDisbursementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDisbursementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
