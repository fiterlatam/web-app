/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { LoansService } from '../loans.service';

/**
 * Loan datatables resolver with intelligent caching.
 */
@Injectable()
export class LoanDatatablesResolver implements Resolve<Object> {

    /**
     * @param {LoansService} LoansService Loans service.
     */
    constructor(private loansService: LoansService) { }

    /**
     * Returns the loan datatables using cached service.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.loansService.getLoanDataTables();
    }

}
