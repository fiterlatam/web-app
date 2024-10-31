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
export class LoanCreditNoteResolver implements Resolve<Object> {

  /**
   * @param {LoansService} loansService Loans service.
   */
  constructor(private loansService: LoansService) { }

  /**
   * Returns the Loan Credit Note data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const loanId = route.paramMap.get('loanId') || route.parent.paramMap.get('loanId');
    if (!isNaN(+loanId)) {
      return this.loansService.getLoanCreditNotes(loanId);
    }
  }
}
