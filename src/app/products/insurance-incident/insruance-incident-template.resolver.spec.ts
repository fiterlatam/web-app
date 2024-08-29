import { TestBed } from '@angular/core/testing';

import { InsuranceIncidentTemplateResolver } from './insurance-incident-template.resolver';

describe('InsuranceIncidentTemplateResolver', () => {
  let resolver: InsuranceIncidentTemplateResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InsuranceIncidentTemplateResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
