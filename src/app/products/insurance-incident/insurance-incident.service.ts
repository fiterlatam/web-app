import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

interface Incident {
  id?: number;
  name: string;
  mandatoryInsurance: boolean;
  voluntaryInsurance: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InsuranceIncidentService {

  constructor() {
  }

  public getIncidents(): Incident[] {
    return [
      {id: 1, name: 'product1', mandatoryInsurance: true, voluntaryInsurance: false},
      {id: 2, name: 'product2', mandatoryInsurance: false, voluntaryInsurance: true},
      {id: 40, name: 'product2', mandatoryInsurance: false, voluntaryInsurance: true},
      {id: 3, name: 'product3', mandatoryInsurance: true, voluntaryInsurance: true}
    ];
  }

  public getIncidentById(id: number): Incident {
    const incidents = this.getIncidents();
    return incidents.filter(incident => incident.id === id)[0];
  }

  public updateIncident(id: number, incident: any): Observable<any> {
    const incidents = this.getIncidents();
    const index = incidents.findIndex(a => a.id === id);
    incidents[index] = incident;
    return of(incident);
   // return this.http.put(`/insurance-incidents/${id}`, incident);
  }
  public createIncident(incident: any): Observable<any> {
    const incidents = this.getIncidents();
    incidents.push(incident);
    return of(incident);
    // return this.http.post('/insurance-incidents
  }

  public  atLeastOneCheckedValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const isVoluntary = formGroup.get('isVoluntary').value;
      const isMandatory = formGroup.get('isMandatory').value;

      return isVoluntary || isMandatory ? null : { atLeastOneChecked: true };
    };
  }
}
