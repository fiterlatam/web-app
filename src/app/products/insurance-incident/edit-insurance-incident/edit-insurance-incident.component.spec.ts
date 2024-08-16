import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInsuranceIncidentComponent } from './edit-insurance-incident.component';

describe('EditInsuranceIncidentComponent', () => {
  let component: EditInsuranceIncidentComponent;
  let fixture: ComponentFixture<EditInsuranceIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInsuranceIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInsuranceIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
