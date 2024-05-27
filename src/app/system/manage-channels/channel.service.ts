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
export class ChannelService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Channel.
   */

  getChannel(sqlSearch: any): Observable<any> {
    console.log("channels service called");
    console.log(sqlSearch);
    const httpParams = new HttpParams()
                            .set('sqlSearch', sqlSearch);

    let data = this.http.get('/channels', { params: httpParams })
    console.log(data);
    return data;
  }

  createChannel(formData: any): Observable<any> {
    console.log("createChannel service called");
    const httpParams = new HttpParams();
    let data = this.http.post('/channels', formData); 
    console.log(data);
    return data;
  }

  getClientallyById(id: any): Observable<any> {
    console.log("createChannel service called");
    const httpParams = new HttpParams();
    let data = this.http.get(`/channels/${id}`);
    console.log(data);
    return data;
  }

  editChannel(formData: any, id: any): Observable<any> {
    return this.http.put(`/channels/${id}`, formData);
  }

  deleteEntity(id: any): Observable<any> {
    return this.http.delete(`/channels/${id}`);
  }

}
