import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CollectionHouseConfigService } from '../collection-house-config.service';

@Injectable({
  providedIn: 'root'
})
export class ViewCollectionHouseConfigResolver implements Resolve<Observable<Object>>  {

  constructor(private collectionHouse: CollectionHouseConfigService){

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Object> {
    const collectionId = route.paramMap.get('id');
    return this.collectionHouse.getCollectionHouseById(collectionId);
  }
}
