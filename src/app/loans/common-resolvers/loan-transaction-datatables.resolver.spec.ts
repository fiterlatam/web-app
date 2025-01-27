import { TestBed } from '@angular/core/testing';

import { LoanTransactionDatatablesResolver } from './loan-transaction-datatables.resolver';

describe('LoanTransactionDatatablesResolver', () => {
  let resolver: LoanTransactionDatatablesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoanTransactionDatatablesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
