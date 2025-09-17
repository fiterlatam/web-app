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

  unblockAccount(data: any, loanId: any): Observable<any> {
    return this.http.post('/blockaccount/'+ loanId + '/unblock', data);
  }
  
  getBlockActiveAccount(loanId: any): Observable<any> {
    return this.http.get('/blockaccount/' + loanId);
  }

  getBlockAccountHistory(loanId: any): Observable<any> {
    return this.http.get('/blockaccount/' + loanId + '/history');
  }

  updateBlockAccount(blockAccount: any, blockAccountId: string): Observable<any> {
    return this.http.put('/blockaccount/' + blockAccountId, blockAccount);
  }
}
