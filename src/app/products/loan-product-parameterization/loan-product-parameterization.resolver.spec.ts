import { TestBed } from '@angular/core/testing';

import { LoanProductParameterizationResolver } from './loan-product-parameterization.resolver';

describe('LoanProductParameterizationResolver', () => {
  let resolver: LoanProductParameterizationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoanProductParameterizationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
