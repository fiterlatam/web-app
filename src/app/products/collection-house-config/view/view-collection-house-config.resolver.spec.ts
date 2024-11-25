import { TestBed } from '@angular/core/testing';

import { ViewCollectionHouseConfigResolver } from './view-collection-house-config.resolver';

describe('ViewCollectionHouseConfigResolver', () => {
  let resolver: ViewCollectionHouseConfigResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ViewCollectionHouseConfigResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
