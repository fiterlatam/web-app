import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ProductParameterizationService {
  baseUrl = '/loan-product-parameters';

  constructor(private http: HttpClient,
              private settingsService: SettingsService) {
  }

  saveParameters(params: any): Observable<any> {
    return this.http.post(this.baseUrl, params);
  }

  retrieveParameters(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  updateParameter(id: number, param: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, param);
  }

  deleteParameter(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  retrieveParameterById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
