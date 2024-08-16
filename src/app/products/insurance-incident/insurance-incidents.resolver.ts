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
export class InsuranceIncidentsResolver implements Resolve<boolean> {

  constructor(private productsService: ProductsService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('InsuranceIncidentsResolver');
    return this.productsService.getLoanProducts();
  }
}
