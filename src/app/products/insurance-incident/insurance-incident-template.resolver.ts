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
export class InsuranceIncidentTemplateResolver implements Resolve<Observable<Object>> {


  constructor(private incidentService: InsuranceIncidentService) {
  }

  resolve(): Observable<Object> {
    return this.incidentService.getTemplate();
  }
}
