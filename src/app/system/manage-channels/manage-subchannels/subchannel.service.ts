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
export class SubChannelService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} SubChannel.
   */

  getSubChannel(channelId: number, sqlSearch: any): Observable<any> {
  
    const httpParams = new HttpParams()
                            .set('sqlSearch', sqlSearch);

    let data = this.http.get(`/channels/${channelId}/subchannels`,{ params: httpParams })
    
    return data;
  }

  createSubChannel(channelId: number, formData: any): Observable<any> {
    
    const httpParams = new HttpParams();
    let data = this.http.post(`/channels/${channelId}/subchannels`, formData); 
    
    return data;
  }

  getClientallyById(channelId: number, id: any): Observable<any> {
    
    const httpParams = new HttpParams();
    let data = this.http.get(`/channels/${channelId}/subchannels/${id}`);
    
    return data;
  }

  editSubChannel(formData: any, channelId: number, id: any): Observable<any> {
    return this.http.put(`/channels/${channelId}/subchannels/${id}`, formData);
  }

  deleteEntity(id: any): Observable<any> {
    return this.http.delete(`/subchannel/${id}`);
  }

}
