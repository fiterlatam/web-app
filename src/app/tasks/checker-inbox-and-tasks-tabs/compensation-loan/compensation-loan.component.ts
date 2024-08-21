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

  /** Loans Data */
  loans: any;
  /** Datasource */
  dataSource: MatTableDataSource<any>;
  /** Rows Selection Data */
  selection: SelectionModel<any>;
  /** Batch Requests */
  batchRequests: any[];
  /** Displayed Columns */
  displayedColumns: string[] = ['select', 'fechaComp', 'fechaDesde', 'fechaHasta', 'nitMatriz', 'empresaMatriz', 'vlrCompraz', 'VlrComision','vlIvaComision', 'vlrNetoCompra', 'recaudos'];

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
    this.route.data.subscribe((data: { recheduleLoansData: any }) => {
      this.loans = data.recheduleLoansData;
      this.dataSource = new MatTableDataSource(this.loans);
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

}
