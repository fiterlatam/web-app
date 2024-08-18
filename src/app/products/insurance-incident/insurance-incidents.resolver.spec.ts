import { TestBed } from '@angular/core/testing';

import { InsuranceIncidentsResolver } from './insurance-incidents.resolver';

describe('InsuranceIncidentsResolver', () => {
  let resolver: InsuranceIncidentsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InsuranceIncidentsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
