/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { LoanDetailsCacheService } from '../services/loan-details-cache.service';

/**
 * Loan datatables resolver with intelligent caching.
 */
@Injectable()
export class LoanDatatablesResolver implements Resolve<Object> {

    /**
     * @param {LoanDetailsCacheService} loanDetailsCacheService Loan details cache service.
     */
    constructor(private loanDetailsCacheService: LoanDetailsCacheService) { }

    /**
     * Returns the loan datatables using cached service.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.loanDetailsCacheService.getDatatables('m_loan');
    }

}
