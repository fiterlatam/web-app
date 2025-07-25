/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { LoanDetailsCacheService } from '../services/loan-details-cache.service';

/**
 * Loan details charges resolver with intelligent caching.
 */
@Injectable()
export class LoanDetailsChargesResolver implements Resolve<Object> {

    /**
     * @param {LoanDetailsCacheService} loanDetailsCacheService Loan details cache service.
     */
    constructor(private loanDetailsCacheService: LoanDetailsCacheService) { }

    /**
     * Returns the Loans with Association data using cached service.
     * @returns {Observable<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const loanId = route.paramMap.get('loanId');
        return this.loanDetailsCacheService.getLoanDetails(loanId);
    }

}
