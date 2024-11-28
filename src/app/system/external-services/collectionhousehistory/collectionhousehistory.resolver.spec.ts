import { TestBed } from '@angular/core/testing';

import { CollectionhousehistoryResolver } from './collectionhousehistory.resolver';

describe('CollectionhousehistoryResolver', () => {
  let resolver: CollectionhousehistoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollectionhousehistoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
