import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from 'app/tasks/tasks.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoansService } from 'app/loans/loans.service';
import { AlertService } from 'app/core/alert/alert.service';
import * as XLSX from 'xlsx';
import { ReportsService } from 'app/reports/reports.service';
import {TranslateService} from '@ngx-translate/core';
import {Injectable, Injector} from '@angular/core';

@Component({
  selector: 'mifosx-claims-writeoffs',
  templateUrl: './claims-writeoffs.component.html',
  styleUrls: ['./claims-writeoffs.component.scss']
})

export class ClaimsWriteoffsComponent implements OnInit {
  reclaimData: any;
  excludedData: any;
  currentReclaimData: any;
  noReclaimData = false;
  selection: SelectionModel<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  excludedDataSource: MatTableDataSource<any> = new MatTableDataSource();
  showReclaimTable = false;
  showExcludedTable = false;
  batchRequests: any[];
  claimTypeSelected: any;
  isProcessing = false;
  displayedColumns =  ['select','clientName','loanAccountNumber','productName','daysInArrears', 'outstandingPrincipal','outstandingInterest','outstandingAval','outstandingMandatoryInsurance','outstandingAllOtherCharges','outstandingPenalty','outstandingTotal','action'];
  displayedColumnsForExcluded =  ['clientName','loanAccountNumber','productName','daysInArrears', 'outstandingPrincipal','outstandingInterest','outstandingAval','outstandingMandatoryInsurance','outstandingAllOtherCharges','outstandingPenalty','outstandingTotal'];

  private _translateService: TranslateService;

  constructor(private route: ActivatedRoute,
                private router: Router,
                private loanService: LoansService,
                private settingsService: SettingsService,
                private tasksService: TasksService,
                private dateUtils: Dates,
                private alertService: AlertService,
                private reportsService: ReportsService,
                private injector: Injector) {

    }

   private get translateService(): TranslateService {
      if (!this._translateService) {
        this._translateService = this.injector.get(TranslateService);
      }
      return this._translateService;
    }

  ngOnInit(): void {}

  showReclaimInfo(filterValue: String) {
      this.claimTypeSelected = filterValue;
      this.currentReclaimData = filterValue;
      this.loanService.showReclaimInfo(filterValue).subscribe(( apiResponseBody: any ) => {
        this.reclaimData = apiResponseBody.reclaimData;
        this.excludedData= apiResponseBody.excludedData;
        if (this.reclaimData != null) {
          this.showReclaimTable = true;
        }
        if (this.excludedData != null) {
            this.showExcludedTable = true;
        }
        this.dataSource = new MatTableDataSource(this.reclaimData);
        this.excludedDataSource = new MatTableDataSource(this.excludedData);

        this.selection = new SelectionModel(true, []);

      });
    }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row: any) => this.selection.select(row));
    }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(filterValue: string = '') {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exclude(loanId: any) {
    let index = -1;
    const claimType = this.claimTypeSelected;
        const formData = {
          claimType
        };
    this.loanService.excludeFromReclaim(loanId, formData).subscribe(( apiResponseBody: any ) => {
      for (let i = 0; i < this.reclaimData.length; i++) {
        if (this.reclaimData[i].id === loanId) {
          index = i;
          break;
          }
        }
      if (index !== -1) {
          this.excludedData.push(this.reclaimData[index])
          this.reclaimData.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.reclaimData);
          this.dataSource._updateChangeSubscription();

          this.excludedDataSource = new MatTableDataSource(this.excludedData);
          this.excludedDataSource._updateChangeSubscription();
      }
      });
  }

bulkLoanClaim($event: Event): void {
    const dateFormat = this.settingsService.dateFormat;
    const transactionDate = this.dateUtils.formatDate(new Date(), dateFormat);
    const locale = this.settingsService.language.code;
    const claimType = this.claimTypeSelected;
    const formData = {
      dateFormat,
      transactionDate,
      claimType,
      locale
    };
    const selectedAccounts = this.selection.selected.length;
    const listSelectedAccounts = this.selection.selected;
    let claimedAccounts = 0;
    this.batchRequests = [];
    let reqId = 1;
    listSelectedAccounts.forEach((element: any) => {
      let url = "";
      if (this.claimTypeSelected != "castigado") {
        url = 'loans/' + element.id + '/transactions?command=claim';
      } else {
        url = 'loans/' + element.id + '/transactions?command=castigado';
      }
      const bodyData = JSON.stringify(formData);
      const batchData = { requestId: reqId++, relativeUrl: url, method: 'POST', body: bodyData };
      this.batchRequests.push(batchData);
    });

    this.export($event, 'claimedLoans');

    this.tasksService.submitBatchData(this.batchRequests).subscribe((response: any) => {
      let errorAlert:string = null;
      response.forEach((responseEle: any) => {

        if (responseEle.statusCode = '200') {
          claimedAccounts++;
          const prefix = this.translateService.instant('errors.processing.loan.request');
          responseEle.body = JSON.parse(responseEle.body);
          if (responseEle.body.httpStatusCode === '403') {

              let errorMessage = responseEle.body.errors[0].userMessageGlobalisationCode || responseEle.body.errors[0].defaultUserMessage || responseEle.body.errors[0].developerMessage;
              const params = responseEle.body.errors[0].args || [];

              errorMessage = this.translateService.instant('errors.' + errorMessage);
              if (params && params.length > 0) {
                for (let i = 0; i < params.length; i++) {
                  errorMessage = errorMessage.replace('{{params[' + i + '].value}}', params[i].value);
                }
              }
              let loanIndex = responseEle.requestId;
              let loanIdWithError = this.selection.selected[loanIndex - 1].id;
              if (errorAlert == null) {
                errorAlert = prefix  + ' ' + loanIdWithError + ': ' + errorMessage + '</p>';
              } else {
                errorAlert = errorAlert  + '<p>' + prefix  + ' ' + loanIdWithError + ': ' + errorMessage + '</p>';
              }
            }
        }
      });
      if (errorAlert != null) {
        this.alertService.alert({ type: 'Validation Error', message: `${errorAlert}`});
      }
    let index = -1;
    this.selection.selected.forEach((element: any) => {
      for (let i = 0; i < this.reclaimData.length; i++) {
              if (this.reclaimData[i].id === element.id) {
                index = i;
                break;
                }
              }
            if (index !== -1) {
                this.reclaimData.splice(index, 1);
            }
    });
    this.dataSource = new MatTableDataSource(this.reclaimData);
    this.dataSource._updateChangeSubscription();
    this.selection = new SelectionModel(true, []);
     // this.reload();
    });
  }

  export($event: Event, reportType: String): void {
    $event.stopPropagation();
        this.isProcessing = true;
        let payload = {};
        let reportName = "Reporte de reclamación de seguro";
        if (this.claimTypeSelected === "guarantor") {
          reportName = "Reporte de reclamación de Aval";
        } else if (this.claimTypeSelected === "castigado") {
         reportName = "Reporte de Castigo de cartera";
        }
        if (reportType === "claimedLoans") {
          reportName = "Reporte de préstamos reclamados";
          let payloadData = "";
          this.selection.selected.forEach((element: any) => {
            payloadData = payloadData + element.id + ',';
          });
          payloadData = payloadData.substring(0, payloadData.length - 1);
          payload = {'R_loanIds' : payloadData};
        }

        this.reportsService.getRunReportData(reportName, payload)
        .subscribe( (res: any) => {
          if (res.data.length > 0) {
            this.alertService.alert({type: 'Report generation', message: `Report: ${reportName} data generated`});

            const displayedColumns: string[] = [];
            res.columnHeaders.forEach((header: any) => {
              displayedColumns.push(header.columnName);
            });

            this.exportToXLS(reportName, res.data, displayedColumns);
          } else {
            this.alertService.alert({type: 'Report generation', message: `Report: ${reportName} without data generated`});
          }
          this.isProcessing = false;
        });
  }

    exportToXLS(reportName: string, csvData: any, displayedColumns: string[]): void {
      const fileName = `${reportName}.xlsx`;
      const data = csvData.map((object: any) => {
        const row = {};
        for (let i = 0; i < displayedColumns.length; i++) {
          row[displayedColumns[i]] = object.row[i];
        }
        return row;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {header: displayedColumns});
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'report');
      XLSX.writeFile(wb, fileName);
    }
}
