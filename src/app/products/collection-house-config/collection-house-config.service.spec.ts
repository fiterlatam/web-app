import { TestBed } from '@angular/core/testing';

import { CollectionHouseConfigService } from './collection-house-config.service';

describe('CollectionHouseConfigService', () => {
  let service: CollectionHouseConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionHouseConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
