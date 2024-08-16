import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {InsuranceIncidentService} from './insurance-incident.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceIncidentResolver implements Resolve<Object> {

  constructor(private incidentService: InsuranceIncidentService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    const incidentId = route.paramMap.get('id');
    return of(this.incidentService.getIncidentById(Number(incidentId)));
  }
}
