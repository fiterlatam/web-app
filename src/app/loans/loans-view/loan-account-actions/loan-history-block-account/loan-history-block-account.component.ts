import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { LoanBlockAccountService } from 'app/loans/services/loan-block-account.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-loan-history-block-account',
  templateUrl: './loan-history-block-account.component.html',
  styleUrls: ['./loan-history-block-account.component.scss']
})
export class LoanHistoryBlockAccountComponent implements OnInit {
  @ViewChild('blockHistoryTable', { static: true }) blockHistoryTable: MatTable<Element>;

  entityId: string;
  entityType: string;
  entityBlockHistory: any;

  /** Status of the loan account */
  status: any;
  /** Choice */
  choice: boolean;

  /** Columns to be displayed in loan blockHistorys table. */
  displayedColumns: string[] = [
    'id',
    'name',
    'applicationDate',
    'accelerate',
    'freezeCurrentInterest',
    'freezeInterestArrears',
    'freezeLifeInsurance',
    'freezeMypime',
    'updatedAt',
    'createdByName'//,
    //'actionName'
  ];
  /** Data source for loan blockHistorys table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for codes table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for codes table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   *
   * @param {MatDialog} dialog Dialog for Inputs.
   * @param {SavingsService} savingsService Savings Account services.
   * @param {LoansService} loansService Loan Account services.
   * @param {ClientsService} clientsService Client services.
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,  
    private blockService: LoanBlockAccountService,
    private alertService: AlertService
  ) {
    this.entityId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.getBlocHistoryData();
  }

  getBlocHistoryData() {
  this.blockService.getBlockAccountHistory(this.entityId).subscribe({
    next: (response) => {
      this.entityBlockHistory = response;

      // ahora sí inicializamos el dataSource con datos
      this.dataSource = new MatTableDataSource(this.entityBlockHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.choice = this.entityBlockHistory.some((item: any) => item.active === true);
    },
    error: (err) => {
      this.alertService.alert({
        type: 'Ok',
        message: err.error?.defaultUserMessage
      });
    }
  });
}


}
