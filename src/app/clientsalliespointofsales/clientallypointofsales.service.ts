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
export class ClientAllyPointOfSalesService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} ClientAllyPointOfSales.
   */

  getClientAllyPointOfSales(parentId: any, sqlSearch: any): Observable<any> {
    console.log("clientallypointofsales service called");
    console.log(sqlSearch);
    const httpParams = new HttpParams()
                            .set('sqlSearch', sqlSearch);

    let data = this.http.get(`/clientally/${parentId}/pointofsales`, { params: httpParams })
    console.log(data);
    return data;      

  }

  createClientAllyPointOfSales(parentId: any, formData: any): Observable<any> {
    console.log("createClientAllyPointOfSales service called");
    const httpParams = new HttpParams();
    let data = this.http.post(`/clientally/${parentId}/pointofsales`, formData); 
    console.log(data);
    return data;
  }

  getClientallyById(parentId: any, id: any): Observable<any> {
    console.log("createClientAllyPointOfSales service called");
    const httpParams = new HttpParams();
    let data = this.http.get(`/clientally/${parentId}/pointofsales/${id}`);
    console.log(data);
    return data;
  }

  editClientAllyPointOfSales(formData: any, parentId: any, id: any): Observable<any> {
    return this.http.put(`/clientally/${parentId}/pointofsales/${id}`, formData);
  }

  deleteEntity(id: any): Observable<any> {
    return this.http.delete(`/clientallypointofsales/${id}`);
  }

  getTemplate(parentId: any): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/clientally/${parentId}/pointofsales/template`, { params: httpParams });
  }

  getCitiesByDepartment(id: any): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/clientsallies/department/${id}/cities`, { params: httpParams });
  }

  getDefaultValuesFromParent(id: any): Observable<any> {
    console.log("createClientsallies service called");
    const httpParams = new HttpParams();
    let data = this.http.get(`/clientsallies/${id}`);
    console.log(data);
    return data;
  }

}
