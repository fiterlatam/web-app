/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Clients service.
 */
@Injectable({
    providedIn: 'root'
})
export class CustomChargeTypeMapService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} CustomChargeTypeMap.
   */

  getCustomChargeTypeMap(customChargeEntityId: any, customChargeTypeId: any): Observable<any> {
    console.log("customchargetypemap service called");
    
    let data = this.http.get(`/customchargeentities/${customChargeEntityId}/customchargetypes/${customChargeTypeId}/map`, {})
    console.log(data);
    return data;
  }

  getCustomChargeEntity(): Observable<any> {
    console.log("customchargetypemap service called");
    let data = this.http.get('/customchargeentities', {})
    console.log(data);
    return data;
  }


  getCustomChargeType(entityId: any): Observable<any> {
    console.log("customchargetypemap service called");
    let data = this.http.get(`/customchargeentities/${entityId}/customchargetypes`, {})
    console.log(data);
    return data;
  }  

  createCustomChargeTypeMap(formData: any, customChargeEntityId: any, customChargeTypeId: any): Observable<any> {
    console.log("createCustomChargeTypeMap service called");
    const httpParams = new HttpParams();
    let data = this.http.post(`/customchargeentities/${customChargeEntityId}/customchargetypes/${customChargeTypeId}/map`, formData)
    console.log(data);
    return data;
  }

  getClientallyById(id: any): Observable<any> {
    console.log("createCustomChargeTypeMap service called");
    const httpParams = new HttpParams();
    let data = this.http.get(`/customchargetypemap/${id}`);
    console.log(data);
    return data;
  }

  editCustomChargeTypeMap(formData: any, customChargeEntityId: any, customChargeTypeId: any, id: any): Observable<any> {
    return this.http.put(`/customchargeentities/${customChargeEntityId}/customchargetypes/${customChargeTypeId}/map/${id}`, formData)
  }  

  deleteEntity(customChargeEntityId: any, customChargeTypeId: any, id: any): Observable<any> {
    return this.http.delete(`/customchargeentities/${customChargeEntityId}/customchargetypes/${customChargeTypeId}/map/${id}`)
    return this.http.delete(`/customchargetypemap/${id}`);
  }

  getTemplate(): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/customchargetypemap/template`, { params: httpParams });
  }

  getCitiesByDepartment(id: any): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/customchargetypemap/department/${id}/cities`, { params: httpParams });
  }

}
