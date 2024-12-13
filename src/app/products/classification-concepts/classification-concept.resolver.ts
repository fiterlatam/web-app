/** Angular Imports */
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

/** rxjs Imports */
import { Observable } from "rxjs";

/** Custom Services */
import { ProductsService } from "app/products/products.service";

/**
 * Classification Concept data resolver.
 */
@Injectable()
export class ClassificationConceptResolver implements Resolve<Object> {
  /**
   * @param {productsService} productsService Products service.
   */
  constructor(private productsService: ProductsService) {}

  /**
   * Returns the Classification Concept data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get("id");
    return this.productsService.getClassificationConcept(id);
  }
}
