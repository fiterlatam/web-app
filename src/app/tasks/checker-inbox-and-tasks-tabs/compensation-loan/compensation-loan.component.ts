import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { TasksService } from 'app/tasks/tasks.service';

@Component({
  selector: 'mifosx-compensation-loan',
  templateUrl: './compensation-loan.component.html',
  styleUrls: ['./compensation-loan.component.scss']
})
export class CompensationLoanComponent implements OnInit {

  /** compensation Data */
  compensation: any;
  /** Datasource */
  dataSource: MatTableDataSource<any>;
  /** Rows Selection Data */
  selection: SelectionModel<any>;
  /** Batch Requests */
  batchRequests: any[];
  /** Displayed Columns */
  displayedColumns: string[] = ['select', 'compensationDate', 'startDate', 'endDate', 'nit', 'companyName',  'bankName','accontType', 'accountNumber', 'purchaseAmount', 'comissionAmount','vaComissionAmount', 'netPurchaseAmount','collectionAmount','netOutstandingAmount'];

  /**
   * Retrieves the reschedule loan data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Dialog} dialog MatDialog.
   * @param {Dates} dateUtils Date Utils.
   * @param {router} router Router.
   * @param {SettingsService} settingsService Settings Service.
   * @param {TasksService} tasksService Tasks Service.
   */

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private dateUtils: Dates,
    private router: Router,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    private tasksService: TasksService) {
    this.route.data.subscribe((data: { compansationLoadData: any }) => {
      this.compensation = data.compansationLoadData;
      this.dataSource = new MatTableDataSource(this.compensation);
      this.selection = new SelectionModel(true, []);
     
    });
  }

  ngOnInit(): void {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  loanResource() {
    this.tasksService.getAllCompensation().subscribe((response: any) => {
      this.compensation = response;
      this.dataSource = new MatTableDataSource(this.compensation);
      this.selection = new SelectionModel(true, []);
    });
  }

  bulkCompensation(command: string){
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    const listSelectedAccounts = this.selection.selected;
    this.batchRequests = [];
    const formData = {
      dateFormat,
      locale,
      status:command
    };
    let reqId = 1;
    listSelectedAccounts.forEach((element: any) => {
      const url = 'clientsallies/compensation/' + element.id ;
      const bodyData = JSON.stringify(formData);
      const batchData = { requestId: reqId++, relativeUrl: url, method: 'POST', body: bodyData };
      this.batchRequests.push(batchData);
    });
    this.tasksService.submitBatchData(this.batchRequests).subscribe((response: any) => {
      this.loanResource();
    });
  }

  applyFilter(filterValue: string = '') {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
