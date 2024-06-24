import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Dates } from 'app/core/utils/dates';
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'mifosx-undo-transactions',
  templateUrl: './undo-transactions.component.html',
  styleUrls: ['./undo-transactions.component.scss']
})
export class UndoTransactionsComponent implements OnInit {

  /** Minimum Due Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Due Date allowed. */
  maxDate = new Date();
  /** Loans account transaction form. */
  undoTransactionForm: UntypedFormGroup;
  /** loans account transaction payment options. */
  paymentTypeOptions: {
    id: number,
    name: string,
    description: string,
    isCashPayment: boolean,
    position: number
  }[];
  /** Flag to enable payment details fields. */
  showPaymentDetails: Boolean = false;
  /** loan account's Id */
  loanAccountId: string;
  /** Transaction Template */
  transactionTemplateData: any;
  /** Channel List */
  channelOptions: any;
  /**
   * Retrieves the Loan Account transaction template data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {LoansService} loansService Loans Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Dates} dateUtils Date Utils.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   * @param {MatDialog} dialog Dialog reference.
   */

  constructor(private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private loansService: LoansService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { loansAccountTransactionTemplate: any }) => {
      this.transactionTemplateData = data.loansAccountTransactionTemplate;
      this.paymentTypeOptions = this.transactionTemplateData.paymentTypeOptions;
    });
    this.loanAccountId = this.route.snapshot.params['loanId'];

  }

  ngOnInit(): void {
    this.maxDate = this.settingsService.businessDate;
    this.createEditTransactionForm();
    this.undoTransactionForm.patchValue({

      'transactionDate': this.transactionTemplateData.date && new Date(this.transactionTemplateData.date),
      'transactionAmount': this.transactionTemplateData.amount,
      'externalId': this.transactionTemplateData.externalId,
      'paymentTypeId': this.transactionTemplateData?.paymentDetailData?.paymentType?.id,
      'channelName': this.transactionTemplateData?.paymentDetailData?.channelName,
    });
    this.loadChannelsForCombobox();
  }

  /**
   * Method to create the Loan Account Transaction Form.
   */
  createEditTransactionForm() {
    this.undoTransactionForm = this.formBuilder.group({
      'transactionDate': ['', Validators.required],
      'transactionAmount': ['', Validators.required],
      'externalId': [''],
      'paymentTypeId': '',
      'channelName': ''
    });
  }

  /**
   * Method to add payment detail fields to the UI.
   */
  addPaymentDetails() {
    this.showPaymentDetails = !this.showPaymentDetails;
    if (this.showPaymentDetails) {
      this.undoTransactionForm.addControl('accountNumber', new UntypedFormControl(''));
      this.undoTransactionForm.addControl('checkNumber', new UntypedFormControl(''));
      this.undoTransactionForm.addControl('routingCode', new UntypedFormControl(''));
      this.undoTransactionForm.addControl('receiptNumber', new UntypedFormControl(''));
      this.undoTransactionForm.addControl('bankNumber', new UntypedFormControl(''));
      this.undoTransactionForm.addControl('channelName', new UntypedFormControl(''));
    } else {
      this.undoTransactionForm.removeControl('accountNumber');
      this.undoTransactionForm.removeControl('checkNumber');
      this.undoTransactionForm.removeControl('routingCode');
      this.undoTransactionForm.removeControl('receiptNumber');
      this.undoTransactionForm.removeControl('bankNumber');
    }
  }
  loadChannelsForCombobox() {
    this.channelOptions = this.transactionTemplateData.channelOptions;
  }
  /**
   * Method to submit the transaction details.
   */
  submit() {
    const accountId = this.route.snapshot.params['loanId'];
    const undoTransactionAccountDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: this.translateService.instant('labels.heading.Undo Transaction'), dialogContext: this.translateService.instant('labels.dialogContext.Are you sure you want undo the transaction') + `${this.transactionTemplateData.id}` }
    });
    const undoTransactionFormData = this.undoTransactionForm.value;
   
    undoTransactionAccountDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        const locale = this.settingsService.language.code;
        const dateFormat = this.settingsService.dateFormat;
        const data = {
          transactionDate: this.dateUtils.formatDate(undoTransactionFormData.transactionDate && new Date(undoTransactionFormData.transactionDate), dateFormat),
          transactionAmount: 0,
          dateFormat,
          locale,
          paymentTypeId : undoTransactionFormData?.paymentTypeId,
          channelName : undoTransactionFormData?.channelName
        };
        this.loansService.executeLoansAccountTransactionsCommand(accountId, 'undo', data, this.transactionTemplateData.id).subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.route.parent });
        });
      }
    });
  }

  clearProperty($event: Event, propertyName: string): void {
    if (propertyName === 'channelName') {
      this.undoTransactionForm.patchValue({
        'channelName': ''
      });
    }
    this.undoTransactionForm.markAsDirty();
    $event.stopPropagation();
  }

}
