/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ClientsService } from '../clients.service';
import {LoansRestructureService} from '../../loans/loans.restructure.service';

/**
 * Client Accounts data resolver.
 */
@Injectable()
export class ClientLoansRestructureResolver implements Resolve<Object> {

    /**
     * @param {ClientsService} ClientsService Clients service.
     */
    constructor(private loansRestructureService: LoansRestructureService) { }

    /**
     * Returns the Client Account data.
     * @returns {Observable<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const clientId = route.parent.paramMap.get('clientId');
        return this.loansRestructureService.getRestructureTemplate(clientId);
    }

}
