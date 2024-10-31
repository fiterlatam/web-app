import { TestBed } from '@angular/core/testing';

import { LoanCreditNoteResolver } from './loan-credit-note.resolver';

describe('LoanCreditNoteResolver', () => {
  let resolver: LoanCreditNoteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LoanCreditNoteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
