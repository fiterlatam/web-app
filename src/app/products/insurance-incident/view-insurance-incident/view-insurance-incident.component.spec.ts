import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInsuranceIncidentComponent } from './view-insurance-incident.component';

describe('ViewInsuranceIncidentComponent', () => {
  let component: ViewInsuranceIncidentComponent;
  let fixture: ComponentFixture<ViewInsuranceIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInsuranceIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInsuranceIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
