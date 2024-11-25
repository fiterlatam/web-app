import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { Observable } from 'rxjs';
import {CustomChargeTypeMapService} from '../customchargetypemap.service';

@Injectable()
export class ViewChargeMapResolver implements Resolve<Object> {
  constructor(private customChargeTypeMapService: CustomChargeTypeMapService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const chargeMapId = route.paramMap.get('chargeMapId');
    return this.customChargeTypeMapService.retrieveOneChargeMap(chargeMapId);
  }

}
