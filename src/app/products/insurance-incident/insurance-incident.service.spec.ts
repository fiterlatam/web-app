import { TestBed } from '@angular/core/testing';

import { InsuranceIncidentService } from './insurance-incident.service';

describe('InsuranceIncidentService', () => {
  let service: InsuranceIncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceIncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
