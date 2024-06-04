import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../products.service';
@Injectable()
export class InterestRateTemplateResolver implements Resolve<Object> {
  constructor(private productsService: ProductsService) {}

  resolve(): Observable<any> {
    return this.productsService.getMaximumCreditRate();
  }

}
