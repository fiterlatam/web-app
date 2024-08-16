import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ProductsService} from '../products.service';
import {InsuranceIncidentService} from './insurance-incident.service';


@Injectable({
  providedIn: 'root'
})
export class InsuranceIncidentsResolver implements Resolve<Observable<Object>> {


  constructor(private incidentService: InsuranceIncidentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    return of(this.incidentService.getIncidents());
  }
}
