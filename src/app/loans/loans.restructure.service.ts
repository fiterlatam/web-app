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
export class LoansRestructureService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  createRestructure(clientId: any, requestData: any) {
    return this.http.post(`/restructureloans/${clientId}`, requestData);
  }
  getRestructureTemplate(clientId: string) {
    return this.http.get(`/restructureloans/${clientId}/template`);
  }

  executeClientCommand(clientId: string, command: string, data: any): Observable<any> {
    return this.http.post(`/restructureloans/${clientId}/${command}`, data);
  }

  restructureLoans(clientId: string, data: any): Observable<any> {
    return this.http.post(`/restructureloans/${clientId}`, data);
  }
}
