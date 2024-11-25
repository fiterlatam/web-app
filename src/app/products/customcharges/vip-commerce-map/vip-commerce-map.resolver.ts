import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {CustomChargeTypeMapService} from '../customchargetypemap.service';

@Injectable()
export class VipCommerceMapResolver implements Resolve<Object> {
  constructor(private customChargeTypeMapService: CustomChargeTypeMapService) {}

  resolve(): Observable<any> {
    return this.customChargeTypeMapService.getVipCommerceTemplate();
  }

}
