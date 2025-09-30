import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../products.service';
@Injectable()
export class GacResolver implements Resolve<Object> {
  constructor(private productsService: ProductsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const gacId = route.paramMap.get('id');
    return this.productsService.getGac(gacId);
  }

}
