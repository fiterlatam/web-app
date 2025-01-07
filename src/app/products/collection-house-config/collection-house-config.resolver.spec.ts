import { TestBed } from '@angular/core/testing';

import { CollectionHouseConfigResolver } from './collection-house-config.resolver';

describe('CollectionHouseConfigResolver', () => {
  let resolver: CollectionHouseConfigResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollectionHouseConfigResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
