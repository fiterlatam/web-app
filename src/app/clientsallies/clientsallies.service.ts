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
export class ClientsalliesService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Clientsallies.
   */

  getClientsallies(sqlSearch: any): Observable<any> {
    let httpParams = new HttpParams();
    if (sqlSearch) {
      httpParams = httpParams.set('sqlSearch', sqlSearch);
    }
    return this.http.get('/clientsallies', {params: httpParams});
  }

  getClientsallies2(sqlSearch: any): Observable<any> {
    console.log("clientsallies service called");

    const httpParams = new HttpParams();
    httpParams.set('sqlSearch', sqlSearch);

    let data = this.http.get('/clientsallies', { params: httpParams })
    console.log(data);
    return data;
  }

  createClientsallies(formData: any): Observable<any> {
    console.log("createClientsallies service called");
    const httpParams = new HttpParams();
    let data = this.http.post('/clientsallies', formData);
    console.log(data);
    return data;
  }

  getClientallyById(id: any): Observable<any> {
    console.log("createClientsallies service called");
    const httpParams = new HttpParams();
    let data = this.http.get(`/clientsallies/${id}`);
    console.log(data);
    return data;
  }

  editClientsallies(formData: any, id: any): Observable<any> {
    return this.http.put(`/clientsallies/${id}`, formData);
  }

  deleteEntity(id: any): Observable<any> {
    return this.http.delete(`/clientsallies/${id}`);
  }

  getTemplate(): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/clientsallies/template`, { params: httpParams });
  }

  getCitiesByDepartment(id: any): Observable<any> {
    const httpParams = new HttpParams();
    return this.http.get(`/clientsallies/department/${id}/cities`, { params: httpParams });
  }

}
