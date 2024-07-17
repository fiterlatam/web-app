/** Angular Imports */
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';
import {SettingsService} from '../../settings/settings.service';

/**
 * Clients service.
 */
@Injectable({
    providedIn: 'root'
})
export class CustomChargeTypeMapService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   * @param settingsService
   */
  constructor(private http: HttpClient,
              private settingsService: SettingsService) { }

  /**
   * @returns {Observable<any>} CustomChargeTypeMap.
   */

  getCustomChargeTypeMap(customChargeEntityId: any, customChargeTypeId: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('customChargeTypeId', customChargeTypeId)
      .set('customChargeEntityId', customChargeEntityId);
    return this.http.get('/customchargeentities/map', { params: httpParams });
  }

  getCustomChargeEntity(): Observable<any> {
    return this.http.get('/customchargeentities', {});
  }

  getCustomChargeTemplate(): Observable<any> {
    return this.http.get('/customchargeentities/template', {});
  }

  getCustomChargeType(entityId: any): Observable<any> {
    return this.http.get(`/customchargeentities/${entityId}/customchargetypes`, {});
  }

  retrieveOneChargeMap(chargeMapId: any): Observable<any> {
    return this.http.get(`/customchargeentities/map/${chargeMapId}`, {});
  }

  createCustomChargeTypeMap(formData: any): Observable<any> {
    return this.http.post('/customchargeentities/map', formData);
  }
  editCustomChargeTypeMap(formData: any, id: any): Observable<any> {
    return this.http.put(`/customchargeentities/map/${id}`, formData);
  }

  deleteChargeMapEntity(id: any): Observable<any> {
    return this.http.delete(`/customchargeentities/map/${id}`);
  }

  getTemplate(): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/customchargetypemap/template`, { params: httpParams });
  }

  getImportTemplate(): Observable<any> {
    const httpParams = new HttpParams()
      .set('tenantIdentifier', 'default')
      .set('locale', this.settingsService.language.code)
      .set('dateFormat', this.settingsService.dateFormat);
    return this.http.get('/customchargeentities/map/downloadtemplate', { params: httpParams, responseType: 'arraybuffer', observe: 'response' });
  }

  createImportDocument(file: File, apiRequestBody: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('locale', this.settingsService.language.code);
    formData.append('dateFormat', this.settingsService.dateFormat);
    formData.append('apiRequestBodyAsJson', JSON.stringify(apiRequestBody));
    return this.http.post('/customchargeentities/map/uploadtemplate', formData, {});
  }

  updateImportDocument(file: File, apiRequestBody: any, id: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('locale', this.settingsService.language.code);
    formData.append('dateFormat', this.settingsService.dateFormat);
    formData.append('id', id);
    formData.append('apiRequestBodyAsJson', JSON.stringify(apiRequestBody));
    return this.http.put('/customchargeentities/map/uploadtemplate', formData, {});
  }

}
