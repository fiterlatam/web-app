import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceIncidentListComponent } from './insurance-incident-list.component';

describe('InsuranceIncidentListComponent', () => {
  let component: InsuranceIncidentListComponent;
  let fixture: ComponentFixture<InsuranceIncidentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceIncidentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceIncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
