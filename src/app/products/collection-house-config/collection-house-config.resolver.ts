import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CollectionHouseConfigService } from './collection-house-config.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionHouseConfigResolver implements Resolve<Observable<Object>>  {

  constructor(private collectionHouse: CollectionHouseConfigService){

  }
  
  resolve(): Observable<Object> {
    return this.collectionHouse.getCollectionHouse();
  }
}
