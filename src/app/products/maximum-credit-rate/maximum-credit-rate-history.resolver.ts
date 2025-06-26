import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {ProductsService} from '../products.service';

@Injectable({
  providedIn: 'root'
})
export class MaximumCreditRateHistoryResolver implements Resolve<Object> {


  constructor(private productsService: ProductsService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    const productTypeId = route.paramMap.get('productTypeId');
    return this.productsService.getMaximumCreditRateHistory(parseInt(productTypeId));
  }
}
