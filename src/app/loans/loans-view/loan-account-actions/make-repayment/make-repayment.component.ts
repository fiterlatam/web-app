/** Angular Imports */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';


/**
 * Loan Make Repayment Component
 */
@Component({
  selector: 'mifosx-make-repayment',
  templateUrl: './make-repayment.component.html',
  styleUrls: ['./make-repayment.component.scss']
})
export class MakeRepaymentComponent implements OnInit, OnDestroy {

  @Input() dataObject: any;
  /** Loan Id */
  loanId: string;
  /** Payment Type Options */
  paymentTypes: any;
  /** Show payment details */
  showPaymentDetails = false;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  /** Repayment Loan Form */
  repaymentLoanForm: UntypedFormGroup;

  transactionProcessingStrategyTypes: any;
  loanProductType: any;
  loanScheduleType: any;

  /** Channel List */
  channelOptions: any;
  bankOptions: any;

  /** Ally List */
  allyOption: any;
  /** Point Of Sales */
  pointSalesOption: any;

  honoAmount: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {LoansService} loanService Loan Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private formBuilder: UntypedFormBuilder,
    private loanService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private settingsService: SettingsService) {
      this.loanId = this.route.snapshot.params['loanId'];

    }

  /**
   * Creates the repayment loan form
   * and initialize with the required values
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createRepaymentLoanForm();
    this.setRepaymentLoanDetails();
    this.loadChannelsForCombobox();
    this.loadAllieForComboBox();
  }

  ngOnDestroy(): void {

  }

  /**
   * Creates the create close form.
   */
  createRepaymentLoanForm() {
    this.repaymentLoanForm = this.formBuilder.group({
      'transactionDate': [this.settingsService.businessDate, Validators.required],
      'transactionAmount': ['', Validators.required],
      'honorariosAmount': '',
      'externalId': '',
      'paymentTypeId': ['', Validators.required],
      'note': '',
      'channelName': ['', Validators.required],
      'repaymentBankId': [''],
      'allyId' : '',
      'pointOfSalesCode' : '',
      'transactionProcessingStrategy' : '',
      'reduceInstallmentAmount': [false],
    });
  }

  setRepaymentLoanDetails() {

    this.paymentTypes = this.dataObject.paymentTypeOptions;
    this.loanProductType = this.dataObject.loanProductType;
    this.loanScheduleType = this.dataObject.loanScheduleType;

    if (this.loanProductType != "SU+ Empresas") {
        this.repaymentLoanForm.get('transactionProcessingStrategy')?.disable();
    } else {
        this.repaymentLoanForm.get('transactionProcessingStrategy')?.enable();
    }
    this.transactionProcessingStrategyTypes = this.dataObject.transactionProcessingStrategyTypes;
    this.repaymentLoanForm.patchValue({
      transactionAmount: this.dataObject.amount,
      transactionProcessingStrategy: this.dataObject.transactionProcessingStrategy,
      honorariosAmount: 0,
    });
  }

  /**
   * Add payment detail fields to the UI.
   */
  addPaymentDetails() {
    this.showPaymentDetails = !this.showPaymentDetails;
    if (this.showPaymentDetails) {
      this.repaymentLoanForm.addControl('accountNumber', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('checkNumber', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('routingCode', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('receiptNumber', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('bankNumber', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('channelName', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('allyId', new UntypedFormControl(''));
      this.repaymentLoanForm.addControl('pointOfSalesCode', new UntypedFormControl(''));
    } else {
      this.repaymentLoanForm.removeControl('accountNumber');
      this.repaymentLoanForm.removeControl('checkNumber');
      this.repaymentLoanForm.removeControl('routingCode');
      this.repaymentLoanForm.removeControl('receiptNumber');
      this.repaymentLoanForm.removeControl('bankNumber');
      this.repaymentLoanForm.removeControl('channelName');
      this.repaymentLoanForm.removeControl('allyId');
      this.repaymentLoanForm.removeControl('pointOfSalesCode');
    }
  }

  loadChannelsForCombobox() {
    this.channelOptions = this.dataObject.channelOptions;
    this.bankOptions = this.dataObject.bankOptions;
}

  loadAllieForComboBox() {
  return this.loanService.getAllies().subscribe((data) => {
    this.allyOption = data;
  });
}

  changeEvent() {
    const alliesId = this.repaymentLoanForm.value.allyId;
    return this.loanService.getPointOfSales(alliesId).subscribe((data) => {
      this.pointSalesOption = data;
    });
  }

  /** Submits the repayment form */
  submit() {
    const repaymentLoanFormData = this.repaymentLoanForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevTransactionDate: Date = this.repaymentLoanForm.value.transactionDate;
    if (repaymentLoanFormData.transactionDate instanceof Date) {
      repaymentLoanFormData.transactionDate = this.dateUtils.formatDate(prevTransactionDate, dateFormat);
    }
    delete(repaymentLoanFormData['allyId']);

    const data = {
      ...repaymentLoanFormData,
      dateFormat,
      locale
    };
    const command = this.dataObject.type.code.split('.')[1];
    this.loanService.submitLoanActionButton(this.loanId, data, command)
      .subscribe((response: any) => {
        this.router.navigate(['../../transactions'], { relativeTo: this.route });
    });
  }

  calculateHonoAmount() {
    const amount = this.repaymentLoanForm.value.transactionAmount;
    this.loanService.calculateHonoAmount(this.loanId, amount)
          .subscribe((response: any) => {
            this.honoAmount = response;
            this.repaymentLoanForm.patchValue({
              transactionAmount : this.repaymentLoanForm.value.transactionAmount + response,
              honorariosAmount: response,
              });
        });
  }

}
