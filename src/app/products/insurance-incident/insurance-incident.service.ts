import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../settings/settings.service';

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
  baseUrl = '/insurance-incidents';

  /**
   * @param {HttpClient} http Http Client to send requests.
   * @param {SettingsService} settingsService Settings Service.
   */
  constructor(private http: HttpClient,
              private settingsService: SettingsService) {
  }

  public getTemplate(): Observable<any> {
      return this.http.get(`${this.baseUrl}/template`);
    }

  public getIncidents(): Observable<any> {
    
    return this.http.get(`${this.baseUrl}`);
  }

  public getIncidentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  public updateIncident(id: number, incident: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, incident);
  }

  public createIncident(incident: any): Observable<any> {
    return this.http.post(this.baseUrl, incident);
  }

  public validateInsuranceIncidentForm(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const isVoluntary = formGroup.get('isVoluntary').value;
      const isMandatory = formGroup.get('isMandatory').value;
      const name = formGroup.get('name').value || '';
      const isNameValid = name.trim().length > 0;

      return (isVoluntary || isMandatory) && isNameValid ? null : {formIsValid: true};
    };
  }
}
