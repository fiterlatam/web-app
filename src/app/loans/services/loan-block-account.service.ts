import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanBlockAccountService {

  constructor(private http: HttpClient) { }


  createBlockAccount(data: any, loanId: any): Observable<any> {
    return this.http.post('/blockaccount/'+ loanId, data);
  }


}
