import { TestBed } from '@angular/core/testing';

import { LoanProductParameterizationListResolver } from './loan-product-parameterization-list.resolver';

describe('LoanProductParameterizationListResolver', () => {
  let resolver: LoanProductParameterizationListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoanProductParameterizationListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
