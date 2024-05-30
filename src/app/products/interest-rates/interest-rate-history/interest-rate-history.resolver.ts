import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../../products.service';
@Injectable()
export class InterestRateHistoryResolver implements Resolve<Object> {
  constructor(private productsService: ProductsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const interestRateId = route.paramMap.get('id');
    return this.productsService.getInterestRateHistory(interestRateId);
  }

}
