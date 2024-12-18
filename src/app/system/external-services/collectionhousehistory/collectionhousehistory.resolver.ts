import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionhousehistoryResolver implements Resolve<Object> {
    /**
   * @param {SystemService} systemService System service.
   */
    constructor(private systemService: SystemService) {}

    /**
     * Returns the Amazon S3 Configuration data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
      return this.systemService.getExternalConfiguration('COLLECTION_HOUSE_HISTORY_PROVIDER');
    }
}
