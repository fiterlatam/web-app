/** Angular Imports */
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Datatables} from '../../../../core/utils/datatables';

/** Custom Dialogs */

/**
 * View Transaction Component.
 * TODO: Add support for account transfers.
 */
@Component({
  selector: 'mifosx-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent {
  /** Transaction data. */
  transactionData: any;

  accountId: any;
  /** Transaction Data Tables */
  entityDatatables: any;

  /**
   * @param route
   * @param {MatDialog} dialog Dialog reference.
   * @param datatables
   */
  constructor(private route: ActivatedRoute,
              public dialog: MatDialog, private datatables: Datatables) {
    this.route.data.subscribe((data: { transactionDatatables: any }) => {
      this.accountId = this.route.snapshot.params['loanAccountId'];
      this.entityDatatables = data.transactionDatatables;
    });
  }
  formatDataTableName(name: string) {
    return this.datatables.formatTableName(name);
  }
}
