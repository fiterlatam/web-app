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
export class ChannelService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Channel.
   */

  getChannel(sqlSearch: any): Observable<any> {
    const httpParams = new HttpParams().set('sqlSearch', sqlSearch);
    return this.http.get('/channels', {params: httpParams});
  }

  createChannel(formData: any): Observable<any> {
    return this.http.post('/channels', formData);
  }

  getChannelById(id: any, template?: boolean): Observable<any> {
    if (template) {
      return this.http.get(`/channels/${id}?template=true`);
    }
    return this.http.get(`/channels/${id}`);
  }

  getTemplate(): Observable<any> {
    return this.http.get('/channels/template');
  }

  editChannel(formData: any, id: any): Observable<any> {
    return this.http.put(`/channels/${id}`, formData);
  }

  deleteEntity(id: any): Observable<any> {
    return this.http.delete(`/channels/${id}`);
  }

}
