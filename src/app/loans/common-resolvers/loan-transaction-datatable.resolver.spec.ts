import { TestBed } from '@angular/core/testing';

import { LoanTransactionDatatableResolver } from './loan-transaction-datatable.resolver';

describe('LoanTransactionDatatableResolver', () => {
  let resolver: LoanTransactionDatatableResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoanTransactionDatatableResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
