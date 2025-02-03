import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import {LoansService} from '../loans.service';

@Injectable({
  providedIn: 'root'
})
export class LoanTransactionDatatableResolver implements Resolve<Object> {

  constructor(private loansService: LoansService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const transactionId = route.parent.parent.paramMap.get('id');
    const datatableName = route.paramMap.get('datatableName');
    return this.loansService.getLoanTransactionDatatable(transactionId, datatableName);
  }
}
