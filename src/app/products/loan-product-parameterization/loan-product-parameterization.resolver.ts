import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ProductParameterizationService} from './product-parameterization.service';

@Injectable({
  providedIn: 'root'
})
export class LoanProductParameterizationResolver implements Resolve<Object> {
  constructor(private productParameterizationService: ProductParameterizationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.productParameterizationService.retrieveParameterById(route.params.id);
  }
}
