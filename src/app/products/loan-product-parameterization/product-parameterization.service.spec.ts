import { TestBed } from '@angular/core/testing';

import { ProductParameterizationService } from './product-parameterization.service';

describe('ProductParameterizationService', () => {
  let service: ProductParameterizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductParameterizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
