import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {LoansService} from '../../../../loans.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Dates} from '../../../../../core/utils/dates';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from '../../../../../settings/settings.service';
import {CurrencyPipe} from '@angular/common';
import {OrganizationService} from '../../../../../organization/organization.service';
import {AlertService} from '../../../../../core/alert/alert.service';
import {LoanTransactionType} from '../../../../models/loan-transaction-type.model';
import {ConfirmationDialogComponent} from '../../../../../shared/confirmation-dialog/confirmation-dialog.component';
import {FormfieldBase} from '../../../../../shared/form-dialog/formfield/model/formfield-base';
import {SelectBase} from '../../../../../shared/form-dialog/formfield/model/select-base';
import {InputBase} from '../../../../../shared/form-dialog/formfield/model/input-base';
import {FormDialogComponent} from '../../../../../shared/form-dialog/form-dialog.component';

@Component({
  selector: 'mifosx-loan-transaction-general-tab',
  templateUrl: './loan-transaction-general-tab.component.html',
  styleUrls: ['./loan-transaction-general-tab.component.scss']
})
export class LoanTransactionGeneralTabComponent implements OnInit {
  locale: string;
  format: string;
  decimalPlace: string;

  /** Transaction data. */
  transactionData: any;
  /** Is Editable */
  allowEdition = true;
  /** Is Undoable */
  allowUndo = true;
  /** Is able to be Chargeback */
  allowChargeback = true;
  existTransactionRelations = false;

  paymentTypeOptions: {}[] = [];
  transactionRelations = new MatTableDataSource();
  /** Columns to be displayed in Transaction Relations table. */
  displayedColumns: string[] = ['relationType', 'toTransaction', 'amount'];
  isFullRelated = false;
  amountRelationsAllowed = 0;

  clientId: number;
  loanId: number;

  channelName: any;
  bankName: any;
  pointOfSalesName: any;

  /**
   * Retrieves the Transaction data from `resolve`.
   * @param {LoansService} loansService Loans Service
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   * @param {Dates} dateUtils Date Utils.
   * @param translateService
   * @param {SettingsService} settingsService Settings Service
   * @param currencyPipe
   * @param organizationService
   * @param {AlertService} alertService Alert Service
   */
  constructor(private loansService: LoansService,
              private route: ActivatedRoute,
              private dateUtils: Dates,
              private router: Router,
              public dialog: MatDialog,
              private translateService: TranslateService,
              private settingsService: SettingsService,
              private currencyPipe: CurrencyPipe,
              private organizationService: OrganizationService,
              private alertService: AlertService) {
    this.route.data.subscribe((data: { loansAccountTransaction: any }) => {
      this.transactionData = data.loansAccountTransaction || {};
      this.allowEdition = !this.transactionData.manuallyReversed && !this.allowTransactionEdition(this.transactionData.type.id );
      this.allowUndo = !this.transactionData.manuallyReversed;
      this.allowChargeback = this.allowChargebackTransaction(this.transactionData.type) && !this.transactionData.manuallyReversed;
      let transactionsChargebackRelated = false;
      if (this.allowChargeback) {
        if (this.transactionData.transactionRelations) {
          this.transactionRelations.data = this.transactionData.transactionRelations;
          this.existTransactionRelations = (this.transactionData.transactionRelations.length > 0);
          let amountRelations = 0;
          this.transactionData.transactionRelations.forEach((relation: any) => {
            if (relation.relationType === 'CHARGEBACK') {
              amountRelations += relation.amount;
              transactionsChargebackRelated = true;
            }
          });
          this.amountRelationsAllowed = this.transactionData.amount - amountRelations;
          this.isFullRelated = (this.amountRelationsAllowed === 0);
          this.allowChargeback = this.allowChargebackTransaction(this.transactionData.type) && !this.isFullRelated;
        }
      }
      if (!this.allowChargeback) {
        this.allowEdition = false;
      }
      if (this.existTransactionRelations && transactionsChargebackRelated) {
        this.allowUndo = false;
      }

      this.channelName = this.transactionData?.paymentDetailData?.channelName;
      this.pointOfSalesName = this.transactionData?.paymentDetailData?.pointOfSales?.name;
      this.bankName = this.transactionData?.paymentDetailData?.bankName;
    });
    this.clientId = this.route.snapshot.params['clientId'];
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit(): void {
    this.locale = this.settingsService.language.code;
    this.decimalPlace = this.settingsService.decimals;
    this.format = `1.${this.decimalPlace}-${ this.decimalPlace}`;
    let disbursementFeesSummary = '';
    if(this.transactionData.disbursementFees){
      for(let i = 0; i < this.transactionData.disbursementFees.length; i++){
        disbursementFeesSummary += this.transactionData.disbursementFees[i].chargeName + ' : ' + this.currencyPipe.transform(this.transactionData.disbursementFees[i].amount, this.transactionData.currency.code, 'symbol-narrow', this.format, this.locale);
        if(i < this.transactionData.disbursementFees.length - 1){
          disbursementFeesSummary += ' + ';
        }
      }
    }
    this.transactionData.disbursementFeesSummary = disbursementFeesSummary;
    console.log(this.transactionData.disbursementFeesSummary);
    if (this.allowChargeback) {
      this.organizationService.getPaymentTypesWithCode().toPromise()
        .then(data => {
          this.paymentTypeOptions = data;
        });
    }
  }

  /**
   * Allow edit, undo and chargeback actions
   */
  allowTransactionEdition(transactionType: number): boolean {
    return (transactionType === 20
      || transactionType === 21 || transactionType === 22
      || transactionType === 23 || transactionType === 28);
  }

  allowChargebackTransaction(transactionType: LoanTransactionType): boolean {
    return (transactionType.repayment
      || transactionType.goodwillCredit || transactionType.payoutRefund
      || transactionType.merchantIssuedRefund || transactionType.downPayment);
  }

  /**
   * Undo the loans transaction
   */
  undoTransaction() {
    const accountId = this.route.snapshot.params['loanId'];
    const undoTransactionAccountDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: this.translateService.instant('labels.heading.Undo Transaction'), dialogContext: this.translateService.instant('labels.dialogContext.Are you sure you want undo the transaction') + `${this.transactionData.id}` }
    });
    undoTransactionAccountDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        const locale = this.settingsService.language.code;
        const dateFormat = this.settingsService.dateFormat;
        const data = {
          transactionDate: this.dateUtils.formatDate(this.transactionData.date && new Date(this.transactionData.date), dateFormat),
          transactionAmount: 0,
          dateFormat,
          locale
        };
        this.loansService.executeLoansAccountTransactionsCommand(accountId, 'undo', data, this.transactionData.id).subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      }
    });
  }

  chargebackTransaction() {
    const accountId = this.route.snapshot.params['loanId'];
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'paymentTypeId',
        label: 'Payment Type',
        value: '',
        options: { label: 'name', value: 'id', data: this.paymentTypeOptions },
        required: true,
        order: 1
      }),
      new InputBase({
        controlName: 'amount',
        label: 'Amount',
        value: this.amountRelationsAllowed,
        type: 'number',
        required: true,
        max: this.amountRelationsAllowed,
        order: 2
      })
    ];
    const data = {
      title: 'Chargeback Repayment Transaction',
      layout: { addButtonText: 'Chargeback' },
      formfields: formfields
    };
    const chargebackDialogRef = this.dialog.open(FormDialogComponent, { data });
    chargebackDialogRef.afterClosed().subscribe((response: { data: any }) => {
      if (response.data) {
        if (response.data.value.amount <= this.amountRelationsAllowed) {
          const locale = this.settingsService.language.code;
          const payload = {
            transactionAmount: response.data.value.amount,
            paymentTypeId: response.data.value.paymentTypeId,
            locale
          };
          this.loansService.executeLoansAccountTransactionsCommand(accountId, 'chargeback', payload, this.transactionData.id).subscribe(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          });
        } else {
          this.alertService.alert({
            type: 'BusinessRule',
            message: 'Chargeback amount must be lower or equal to: ' + this.amountRelationsAllowed
          });
        }
      }
    });
  }

  loanTransactionRelatedLink(transactionId: number) {
    return `/#/clients/${this.clientId}/loans-accounts/${this.loanId}/transactions/${transactionId}`;
  }

  loanTransactionColor(): string {
    if (this.transactionData.manuallyReversed) {
      return 'undo';
    }
    if (this.existTransactionRelations) {
      return 'linked';
    }
    return 'active';
  }

  // simple function to concatenate the first name and last name of the last modified by user
  lastModifiedByFullName(): string {
    return `${this.transactionData.lastModifiedByFirstname} ${this.transactionData.lastModifiedByLastname}`;
  }


}
