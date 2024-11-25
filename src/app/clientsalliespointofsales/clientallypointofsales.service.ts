/** Angular Imports */
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';

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

  getClientAllyPointOfSales(parentId: any, sqlSearch: any): Observable<any> {
    const httpParams = new HttpParams().set('sqlSearch', sqlSearch);
    return this.http.get(`/clientally/${parentId}/pointofsales`, {params: httpParams});
  }

  createClientAllyPointOfSales(parentId: any, formData: any): Observable<any> {
    return this.http.post(`/clientally/${parentId}/pointofsales`, formData);
  }

  getClientallyById(parentId: any, id: any): Observable<any> {
    return this.http.get(`/clientally/${parentId}/pointofsales/${id}`);
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
    return this.http.get(`/clientsallies/${id}`);
  }

}
