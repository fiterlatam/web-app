import { TestBed } from '@angular/core/testing';

import { InsuranceIncidentResolver } from './insurance-incident.resolver';

describe('InsuranceIncidentResolver', () => {
  let resolver: InsuranceIncidentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InsuranceIncidentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
