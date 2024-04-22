import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { SystemService } from '../../system.service';


@Injectable()
export class ViewManageBlockingReasonsComponentResolverService implements Resolve<Object> {

 
  constructor(private systemService: SystemService) {}

 
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const blockingReasonId = route.paramMap.get('id');
    return this.systemService.getBlockingReason(blockingReasonId);
  }

}
