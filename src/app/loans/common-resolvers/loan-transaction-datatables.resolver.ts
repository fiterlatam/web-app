import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {LoansService} from '../loans.service';

@Injectable({
  providedIn: 'root'
})
export class LoanTransactionDatatablesResolver implements Resolve<Object> {

  constructor(private loansService: LoansService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.loansService.getLoanTransactionDatatables();
  }
}
