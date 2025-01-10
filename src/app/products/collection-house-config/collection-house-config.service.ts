import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import { Observable } from 'rxjs';

interface Incident {
  collectionName: string;
  collectionNit: string;
  collectionCode: string;
  collectionVerify: number;
}

@Injectable({
  providedIn: 'root'
})

export class CollectionHouseConfigService {
  baseUrl = '/collectionhousemanagement';
  /**
   * @param {HttpClient} http Http Client to send requests.
   * @param {SettingsService} settingsService Settings Service.
   */
  constructor(private http: HttpClient,
    private settingsService: SettingsService
  ) {
  }

  public getCollectionHouse(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  public getCollectionHouseById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  public createCollectionHouse(collectionHouse: any): Observable<any> {
    return this.http.post(this.baseUrl, collectionHouse);
  }

  public updateCollectionHouse(id: number, collectionHouse: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, collectionHouse);
  }
}
