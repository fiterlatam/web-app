/** Angular Imports */
import {Component, Input, ViewChild, OnChanges, Output, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';

/** Custom Servies */
import { ReportsService } from '../../reports.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { ProgressBarService } from 'app/core/progress-bar/progress-bar.service';

import * as XLSX from 'xlsx';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';

/**
 * Table and SMS Component
 */
@Component({
  selector: 'mifosx-table-and-sms',
  templateUrl: './table-and-sms.component.html',
  styleUrls: ['./table-and-sms.component.scss']
})
export class TableAndSmsComponent implements OnChanges {

  /** Run Report Data */
  @Input() dataObject: any;

  /** Columns to be displayed in mat-table */
  displayedColumns: string[] = [];
  /** Data source for run-report table. */
  dataSource = new MatTableDataSource();
  /** Maps column name to type */
  columnTypes: any[] = [];
  /** substitute for resolver */
  hideOutput = true;
  /** Data to be converted into CSV file */
  csvData: any;
  notExistsReportData = false;
  toBeExportedToRepo = false;
  @Input() isCollapsed: boolean;
  @Output() isCollapsedChange = new EventEmitter<boolean>();

  /** Paginator for run-report table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * @param {ReportsService} reportsService Reports Service
   * @param dialog
   * @param {DecimalPipe} decimalPipe Decimal Pipe
   * @param dateFormatPipe
   * @param progressBarService
   */
  constructor(private reportsService: ReportsService,
          public dialog: MatDialog,
          private decimalPipe: DecimalPipe,
          private dateFormatPipe: DateFormatPipe,
          private progressBarService: ProgressBarService) { }

  /**
   * Fetches run report data post changes in run report form.
   */
  ngOnChanges() {
    this.hideOutput = true;
    this.columnTypes = [];
    this.displayedColumns = [];
    this.getRunReportData();
  }

  getRunReportData() {
    const exportS3 = this.dataObject.formData.exportS3;
    this.reportsService.getRunReportData(this.dataObject.report.name, this.dataObject.formData)
    .subscribe( (res: any) => {
      this.toBeExportedToRepo = exportS3;
      if (!this.toBeExportedToRepo) {
        this.csvData = res.data;
        this.notExistsReportData = (res.data.length === 0);
        this.setOutputTable(res.data);
        res.columnHeaders.forEach((header: any) => {
          this.columnTypes.push(header.columnDisplayType);
          this.displayedColumns.push(header.columnName);
        });
      }
      this.hideOutput = false;
      this.progressBarService.decrease();
    });
  }

  /**
   * Sets up a dynamic Mat Table.
   * @param {any} data Mat Table data
   */
  setOutputTable(data: any) {
    this.dataSource = new MatTableDataSource(data);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Generates the CSV file dynamically for run report data.
   */
  exportCsvFile() {
    const fileName = `${this.dataObject.report.name}_${this.timestampString()}.csv`;
    const delimiter = environment.defaultCharDelimiter || ',';
    this.downloadCSV(fileName, delimiter);
  }

  timestampString() {
    return new Date().getFullYear() + '_' + (new Date().getMonth() + 1) + '_' + new Date().getDate() + '_' + new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds()
  }

  exportToXLS(): void {
    const fileName = `${this.dataObject.report.name}_${this.timestampString()}.xlsx`;
    const data = this.csvData.map((object: any) => {
      const row = {};
      for (let i = 0; i < this.displayedColumns.length; i++) {
        if (this.isDate(i)) {
          row[this.displayedColumns[i]] = this.dateFormatPipe.transform(object.row[i]);
        } else {
          row[this.displayedColumns[i]] = object.row[i];
        }
      }
      return row;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {header: this.displayedColumns});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, fileName);
  }

  /**
   * Generates the CSV file dynamically for run report data.
   */
  downloadCSV(fileName: string, delimiter: string) {
    const csvToBeExported = this.csvData.map((dt: any) => {
      for (let i = 0; i < this.displayedColumns.length; i++) {
        if (this.isDate(i)) {
          dt.row[i] = this.dateFormatPipe.transform(dt.row[i]);
        }
      }
      return dt;
    });
    const headers = this.displayedColumns;
    let csv = csvToBeExported.map((object: any) => object.row.join(delimiter));
    csv.unshift(`data:text/csv;charset=utf-8,${headers.join(delimiter)}`);
    csv = csv.join('\r\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Returns number formatted as per user's decimal choice.
   * @param {number} value Value to be formatted as per decimal choice.
   */
  toDecimal(value: number) {
    const decimalChoice = this.dataObject.decimalChoice;
    return this.decimalPipe.transform(value, `1.${decimalChoice}-${decimalChoice}`);
  }

  /**
   * Checks the weather Mat-Table column has decimal display type.
   * @param {number} index Index of column.
   */
  isDecimal(index: number) {
    return this.columnTypes[index] === 'DECIMAL';
  }

  isDate(index: number) {
    return this.columnTypes[index] === 'DATE';
  }
}
