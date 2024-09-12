import { TestBed } from '@angular/core/testing';

import { MaximumCreditRateHistoryResolver } from './maximum-credit-rate-history.resolver';

describe('MaximumCreditRateHistoryResolver', () => {
  let resolver: MaximumCreditRateHistoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MaximumCreditRateHistoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
