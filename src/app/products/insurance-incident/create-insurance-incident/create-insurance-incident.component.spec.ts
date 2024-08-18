import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsuranceIncidentComponent } from './create-insurance-incident.component';

describe('CreateInsuranceIncidentComponent', () => {
  let component: CreateInsuranceIncidentComponent;
  let fixture: ComponentFixture<CreateInsuranceIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsuranceIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInsuranceIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
