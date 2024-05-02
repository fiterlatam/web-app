/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';

/** rxjs Imports */
import { Observable } from 'rxjs';



/**
 * BlockByControlListsResolver data resolver.
 */
@Injectable()
export class BlockByControlListsResolver implements Resolve<Object> {


  /**
   * @param {OrganizationService} organizationService Organization service.
   */
  constructor(private organizationService: OrganizationService) {
  }

  /**
   * Returns the imports data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {

    return this.organizationService.getImports("clientblock");
  }

}
