/** Angular Imports */
import {Component, OnInit, Input, OnChanges, EventEmitter, Output} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {
  LoansAccountAddCollateralDialogComponent
} from 'app/loans/custom-dialog/loans-account-add-collateral-dialog/loans-account-add-collateral-dialog.component';
import {LoanProducts} from 'app/products/loan-products/loan-products';
import {SettingsService} from 'app/settings/settings.service';
import {DeleteDialogComponent} from 'app/shared/delete-dialog/delete-dialog.component';
import {FormDialogComponent} from 'app/shared/form-dialog/form-dialog.component';
import {DatepickerBase} from 'app/shared/form-dialog/formfield/model/datepicker-base';
import {FormfieldBase} from 'app/shared/form-dialog/formfield/model/formfield-base';
import {InputBase} from 'app/shared/form-dialog/formfield/model/input-base';
import {CodeName, OptionData} from 'app/shared/models/option-data.model';
import {LoansService} from 'app/loans/loans.service';

import { debounceTime } from 'rxjs/operators';

export const principalAmountChangeEvent = new EventEmitter<{ id: number; nome: string }>();

/**
 * Create Loans Account Terms Step
 */
@Component({
  selector: 'mifosx-loans-account-terms-step',
  templateUrl: './loans-account-terms-step.component.html',
  styleUrls: ['./loans-account-terms-step.component.scss']
})


export class LoansAccountTermsStepComponent implements OnInit, OnChanges {

  /** Loans Product Options */
  @Input() loansProductOptions: any;
  /** Loans Account Product Template */
  @Input() loansAccountProductTemplate: any;
  /** Loans Account Template */
  @Input() loansAccountTemplate: any;
  loansAccountTermsData: any;

  /** Is Multi Disburse Loan  */
  multiDisburseLoan: any;
  // @Input() loansAccountFormValid: LoansAccountFormValid
  @Input() loansAccountFormValid: boolean;
  // @Input collateralOptions: Collateral Options
  @Input() collateralOptions: any;
  // @Input loanPrincipal: Loan Principle
  @Input() loanPrincipal: any;

  @Input() loanProductType: string;

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date(2100, 0, 1);
  /** Loans Account Terms Form */
  loansAccountTermsForm: UntypedFormGroup;
  /** Term Frequency Type Data */
  termFrequencyTypeData: any;
  /** Repayment Frequency Nth Day Type Data */
  repaymentFrequencyNthDayTypeData: any;
  /** Repayment Frequency Days of Week Type Data */
  repaymentFrequencyDaysOfWeekTypeData: any;
  /** Interest Type Data */
  interestTypeData: any;
  /** Amortization Type Data */
  amortizationTypeData: any;
  /** Interest Calculation Period Type Data */
  interestCalculationPeriodTypeData: any;
  /** Client Active Loan Data */
  clientActiveLoanData: any;
  /** Multi Disbursement Data */
  disbursementDataSource: {}[] = [];
  currencyDisplaySymbol = '$';
  /** Loan repayment strategies */
  transactionProcessingStrategyOptions: any = [];
  repaymentStrategyDisabled = false;
  /** Check if value of collateral added  is more than principal amount */
  isCollateralSufficient = false;
  /** Total value of all collateral added to a loan */
  totalCollateralValue: any = 0;
  /** Collateral Data Source */
  collateralDataSource: {}[] = [];
  /** Columns to be displayed in collateral table. */
  loanCollateralDisplayedColumns: string[] = ['type', 'value', 'totalValue', 'totalCollateralValue', 'action'];
  /** Disbursement Data Displayed Columns */
  disbursementDisplayedColumns: string[] = ['expectedDisbursementDate', 'principal', 'actions'];
  /** Multi Disbursement Control */
  totalMultiDisbursed: any = 0;
  isMultiDisbursedCompleted = false;
  requirePoints = false;

  /** Component is pristine if there has been no changes by user interaction */
  pristine = true;

  loanId: any = null;

  loanScheduleType: OptionData | null = null;


  /**
   * Create Loans Account Terms Form
   * @param formBuilder FormBuilder
   * @param {SettingsService} settingsService SettingsService
   * @param route
   * @param dialog
   * @param {LoansService} loansService LoansService
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private settingsService: SettingsService,
              private route: ActivatedRoute,
              public dialog: MatDialog, public loansService: LoansService) {
    this.loanId = this.route.snapshot.params['loanId'];
    this.createLoansAccountTermsForm();
  }

  /**
   * Executes on change of input values
   */
  ngOnChanges() {
    setTimeout(() => {
      if (this.loansAccountProductTemplate) {
        this.loansAccountTermsData = this.loansAccountProductTemplate;
        this.requirePoints = this.loansAccountProductTemplate ? this.loansAccountProductTemplate['product'] ? this.loansAccountProductTemplate['product']?.requirePoints : false : false;
        this.currencyDisplaySymbol = this.loansAccountTermsData.currency.displaySymbol;
        if (this.loanId != null && this.loansAccountTemplate.accountNo) {
          this.loansAccountTermsData = this.loansAccountTemplate;
        }
        const interestRatePoints = this.loansAccountTermsForm.value.interestRatePoints ?? this.loansAccountTermsData.interestRatePoints;
        this.loansAccountTermsForm.patchValue({
          'principalAmount': this.loansAccountTermsData.principal,
          'loanTermFrequency': this.loansAccountTermsData.termFrequency,
          'loanTermFrequencyType': this.loansAccountTermsData.termPeriodFrequencyType.id,
          'numberOfRepayments': this.loansAccountTermsData.numberOfRepayments,
          'repaymentEvery': this.loansAccountTermsData.repaymentEvery,
          'repaymentFrequencyType': this.loansAccountTermsData.repaymentFrequencyType.id,
          'interestRatePoints': interestRatePoints,
          'amortizationType': this.loansAccountTermsData.amortizationType.id,
          'isEqualAmortization': this.loansAccountTermsData.isEqualAmortization,
          'interestType': this.loansAccountTermsData.interestType.id,
          'isFloatingInterestRate': this.loansAccountTermsData.isLoanProductLinkedToFloatingRate ? false : '',
          'interestCalculationPeriodType': this.loansAccountTermsData.interestCalculationPeriodType.id,
          'allowPartialPeriodInterestCalcualtion': this.loansAccountTermsData.allowPartialPeriodInterestCalcualtion,
          'inArrearsTolerance': this.loansAccountTermsData.inArrearsTolerance,
          'graceOnPrincipalPayment': this.loansAccountTermsData.graceOnPrincipalPayment,
          'graceOnInterestPayment': this.loansAccountTermsData.graceOnInterestPayment,
          'graceOnArrearsAgeing': this.loansAccountTermsData.graceOnArrearsAgeing,
          'graceOnInterestCharged': this.loansAccountTermsData.graceOnInterestCharged,
          'fixedEmiAmount': this.loansAccountTermsData.fixedEmiAmount,
          'maxOutstandingLoanBalance': this.loansAccountTermsData.maxOutstandingLoanBalance,
          'transactionProcessingStrategyCode': this.loansAccountTermsData.transactionProcessingStrategyCode,
          'interestRateDifferential': this.loansAccountTermsData.interestRateDifferential,
          'multiDisburseLoan': this.loansAccountTermsData.multiDisburseLoan,
          'interestRatePerPeriod': this.loansAccountTermsData.interestRatePerPeriod,
        });

        if (this.loansAccountTermsData) {
          if (this.loansAccountTermsData?.valorDescuento) {
            this.loansAccountTermsForm.patchValue({valorDescuento: this.loansAccountTermsData.valorDescuento});
            this.loansAccountTermsForm.patchValue({valorGiro: this.loansAccountTermsData.valorGiro});
          }

          if (!this.loansAccountTermsData['isLoanProductLinkedToFloatingRate'] && this.requirePoints) {
            this.loansAccountTermsForm.get('interestRatePoints')?.addValidators([Validators.required, Validators.min(0), Validators.max(100)]);
          } else {
            this.loansAccountTermsForm.get('interestRatePoints')?.clearValidators();
          }
        }

        this.multiDisburseLoan = this.loansAccountTermsData.multiDisburseLoan;
        if (this.loansAccountTermsData.disbursementDetails) {
          this.disbursementDataSource = this.loansAccountTermsData.disbursementDetails;
          this.totalMultiDisbursed = 0;
          this.disbursementDataSource.forEach((item: any) => {
            this.totalMultiDisbursed += item.principal;
          });
        }

        this.collateralDataSource = this.loansAccountTermsData.collateral || [];

        const allowAttributeOverrides = this.loansAccountTermsData.product.allowAttributeOverrides;
        if (!allowAttributeOverrides.repaymentEvery) {
          this.loansAccountTermsForm.controls.repaymentEvery.disable();
          this.loansAccountTermsForm.controls.repaymentFrequencyType.disable();
        }
        if (!allowAttributeOverrides.interestType) {
          this.loansAccountTermsForm.controls.interestType.disable();
        }
        if (!allowAttributeOverrides.amortizationType) {
          this.loansAccountTermsForm.controls.amortizationType.disable();
        }
        if (!allowAttributeOverrides.interestCalculationPeriodType) {
          this.loansAccountTermsForm.controls.interestCalculationPeriodType.disable();
          this.loansAccountTermsForm.controls.allowPartialPeriodInterestCalcualtion.disable();
        }
        if (!allowAttributeOverrides.inArrearsTolerance) {
          this.loansAccountTermsForm.controls.inArrearsTolerance.disable();
        }
        if (!allowAttributeOverrides.transactionProcessingStrategyCode) {
          this.loansAccountTermsForm.controls.transactionProcessingStrategyCode.disable();
        }
        if (!allowAttributeOverrides.graceOnPrincipalAndInterestPayment) {
          this.loansAccountTermsForm.controls.graceOnPrincipalPayment.disable();
        }
        if (!allowAttributeOverrides.graceOnPrincipalAndInterestPayment) {
          this.loansAccountTermsForm.controls.graceOnInterestPayment.disable();
        }
        if (!allowAttributeOverrides.graceOnArrearsAgeing) {
          this.loansAccountTermsForm.controls.graceOnArrearsAgeing.disable();
        }
        this.setOptions();
      }
    }, 0);
  }

  ngOnInit() {
    this.maxDate = this.settingsService.maxFutureDate;
    this.loansAccountTermsData = this.loansAccountProductTemplate;
    if (this.loanId != null && this.loansAccountTemplate.accountNo) {
      this.loansAccountTermsData = this.loansAccountTemplate;
    }

    if (this.loansAccountTermsData) {
      if (this.loansAccountTermsData.loanProductId) {
        this.loansAccountTermsForm.patchValue({
          'repaymentsStartingFromDate': this.loansAccountTermsData.expectedFirstRepaymentOnDate && new Date(this.loansAccountTermsData.expectedFirstRepaymentOnDate)
        });
      }
      this.loansAccountTermsForm.patchValue({
        'principalAmount': this.loansAccountTermsData.principal,
        'loanTermFrequency': this.loansAccountTermsData.termFrequency,
        'loanTermFrequencyType': this.loansAccountTermsData.termPeriodFrequencyType.id,
        'numberOfRepayments': this.loansAccountTermsData.numberOfRepayments,
        'repaymentEvery': this.loansAccountTermsData.repaymentEvery,
        'repaymentFrequencyType': this.loansAccountTermsData.repaymentFrequencyType.id,
        'interestRatePoints': this.loansAccountTermsData.interestRatePoints,
        'amortizationType': this.loansAccountTermsData.amortizationType.id,
        'isEqualAmortization': this.loansAccountTermsData.isEqualAmortization,
        'interestType': this.loansAccountTermsData.interestType.id,
        'isFloatingInterestRate': this.loansAccountTermsData.isLoanProductLinkedToFloatingRate ? false : '',
        'interestCalculationPeriodType': this.loansAccountTermsData.interestCalculationPeriodType.id,
        'allowPartialPeriodInterestCalcualtion': this.loansAccountTermsData.allowPartialPeriodInterestCalcualtion,
        'inArrearsTolerance': this.loansAccountTermsData.inArrearsTolerance,
        'graceOnPrincipalPayment': this.loansAccountTermsData.graceOnPrincipalPayment,
        'graceOnInterestPayment': this.loansAccountTermsData.graceOnInterestPayment,
        'graceOnArrearsAgeing': this.loansAccountTermsData.graceOnArrearsAgeing,
        'graceOnInterestCharged': this.loansAccountTermsData.graceOnInterestCharged,
        'fixedEmiAmount': this.loansAccountTermsData.fixedEmiAmount,
        'maxOutstandingLoanBalance': this.loansAccountTermsData.maxOutstandingLoanBalance,
        'transactionProcessingStrategyCode': this.loansAccountTermsData.transactionProcessingStrategyCode,
        'interestRateDifferential': this.loansAccountTermsData.interestRateDifferential,
        'multiDisburseLoan': this.loansAccountTermsData.multiDisburseLoan,
        'interestRatePerPeriod': this.loansAccountTermsData.interestRatePerPeriod,
      });
    }
    this.createLoansAccountTermsForm();
    // this.setCustomValidators();
    this.setLoanTermListener();
  }

  allowAddDisbursementDetails() {
    return (this.multiDisburseLoan && !this.loansAccountTermsData.disallowExpectedDisbursements);
  }

  /** Custom Validators for the form */
  setCustomValidators() {
    const repaymentFrequencyNthDayType = this.loansAccountTermsForm.get('repaymentFrequencyNthDayType');
    const repaymentFrequencyDayOfWeekType = this.loansAccountTermsForm.get('repaymentFrequencyDayOfWeekType');

    this.loansAccountTermsForm.get('repaymentFrequencyType').valueChanges
      .subscribe(repaymentFrequencyType => {

        if (repaymentFrequencyType === 2) {
          repaymentFrequencyNthDayType.setValidators([Validators.required]);
          repaymentFrequencyDayOfWeekType.setValidators([Validators.required]);
        } else {
          repaymentFrequencyNthDayType.setValidators(null);
          repaymentFrequencyDayOfWeekType.setValidators(null);
        }

        repaymentFrequencyNthDayType.updateValueAndValidity();
        repaymentFrequencyDayOfWeekType.updateValueAndValidity();
      });
  }

  /** Custom Listeners for the form to calculate Loan Term */
  setLoanTermListener() {
    this.loansAccountTermsForm.get('numberOfRepayments').valueChanges
      .subscribe(numberOfRepayments => {
        const repaymentEvery: number = this.loansAccountTermsForm.value.repaymentEvery;
        this.calculateLoanTerm(numberOfRepayments, repaymentEvery);
      });

    this.loansAccountTermsForm.get('repaymentEvery').valueChanges
      .subscribe(repaymentEvery => {
        const numberOfRepayments: number = this.loansAccountTermsForm.value.numberOfRepayments;
        this.calculateLoanTerm(numberOfRepayments, repaymentEvery);
      });

    this.loansAccountTermsForm.get('loanTermFrequencyType').valueChanges
      .subscribe(loanTermFrequencyType => {
        this.loansAccountTermsForm.patchValue({'repaymentFrequencyType': loanTermFrequencyType});
      });


      // If principal amount changes, then we need to revisit charges rules on charge-step-component.
     this.loansAccountTermsForm.controls['principalAmount']
     .valueChanges
     .pipe(
       debounceTime(1000) // Aguarda 1 segundo sem alterações antes de executar
     )
     .subscribe(value => {
       const newPrincipalAmountValue = { id: value, nome: `Principal Amount Changed on ${Date.now()}` };
       principalAmountChangeEvent.emit(newPrincipalAmountValue);       
     });      

  }

  /** Create Loans Account Terms Form */
  createLoansAccountTermsForm() {
    this.loansAccountTermsForm = this.formBuilder.group({
      'principalAmount': ['', Validators.required],
      'loanTermFrequency': [{value: '', disabled: true}, Validators.required],
      'loanTermFrequencyType': ['', Validators.required],
      'numberOfRepayments': ['', Validators.required],
      'repaymentEvery': ['', Validators.required],
      'repaymentFrequencyType': [{value: '', disabled: true}, Validators.required],
      'repaymentFrequencyNthDayType': [''],
      'repaymentFrequencyDayOfWeekType': [''],
      'repaymentsStartingFromDate': [''],
      'interestChargedFromDate': [''],
      'interestRatePoints': [''],
      'interestType': [''],
      'isFloatingInterestRate': [''],
      'isEqualAmortization': [''],
      'amortizationType': ['', Validators.required],
      'interestCalculationPeriodType': [''],
      'allowPartialPeriodInterestCalcualtion': [''],
      'inArrearsTolerance': [''],
      'graceOnInterestCharged': [''],
      'graceOnPrincipalPayment': [''],
      'graceOnInterestPayment': [''],
      'graceOnArrearsAgeing': [''],
      'loanIdToClose': [''],
      'fixedEmiAmount': [''],
      'isTopup': [''],
      'maxOutstandingLoanBalance': [''],
      'interestRateDifferential': [''],
      'transactionProcessingStrategyCode': [{value: '', disabled: this.repaymentStrategyDisabled}, Validators.required],
      'multiDisburseLoan': [false],
      'valorDescuento': ['', Validators.required],
      'valorGiro': ['', {disabled: true}],
      'interestRatePerPeriod': ['']
    });
  }

  calculateLoanTerm(numberOfRepayments: number, repaymentEvery: number): void {
    const loanTerm = numberOfRepayments * repaymentEvery;
    this.loansAccountTermsForm.patchValue({'loanTermFrequency': loanTerm});
  }

  /**
   * Gets the Disbursement Data array.
   * @returns {Array} Disbursement Data array.
   */
  get disbursementData() {
    return {
      disbursementData: this.disbursementDataSource
    };
  }

  /**
   * Adds the Disbursement Data entry form to given Disbursement Data entry.
   */
  addDisbursementDataEntry() {
    const currentPrincipalAmount = this.loansAccountTermsForm.get('principalAmount').value;
    const formfields: FormfieldBase[] = [
      new DatepickerBase({
        controlName: 'expectedDisbursementDate',
        label: 'Expected Disbursement Date',
        value: new Date() || '',
        type: 'datetime-local',
        minDate: this.minDate,
        maxDate: this.maxDate,
        required: true,
        order: 1
      }),
      new InputBase({
        controlName: 'principal',
        label: `Principal(It should be less than equal to the ${currentPrincipalAmount})`,
        value: '',
        type: 'number',
        required: true,
        order: 2
      })
    ];
    const data = {
      title: 'Add Disbursement Details',
      layout: {addButtonText: 'Add'},
      formfields: formfields
    };
    const disbursementDialogRef = this.dialog.open(FormDialogComponent, {data});
    disbursementDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const principal = response.data.value.principal * 1;
        if ((this.totalMultiDisbursed + principal) <= currentPrincipalAmount) {
          this.disbursementDataSource = this.disbursementDataSource.concat(response.data.value);
          this.totalMultiDisbursed += principal;
          this.isMultiDisbursedCompleted = (this.totalMultiDisbursed === currentPrincipalAmount);
          this.pristine = false;
        }
      }
    });
  }

  /**
   * Removes the Disbursement Data entry form from given Disbursement Data entry form array at given index.
   * @param {number} index Array index from where Disbursement Data entry form needs to be removed.
   */
  removeDisbursementDataEntry(index: number) {
    const currentPrincipalAmount = this.loansAccountTermsForm.get('principalAmount').value;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {deleteContext: `this`}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        const principal = this.disbursementDataSource[index]['principal'] * 1;
        this.disbursementDataSource.splice(index, 1);
        this.disbursementDataSource = this.disbursementDataSource.concat([]);
        this.totalMultiDisbursed -= principal;
        this.isMultiDisbursedCompleted = (this.totalMultiDisbursed === currentPrincipalAmount);
      }
    });
  }

  /**
   * Add a Collateral to the loan
   */
  addCollateral() {
    const addCollateralDialogRef = this.dialog.open(LoansAccountAddCollateralDialogComponent, {
      data: {collateralOptions: this.collateralOptions}
    });
    addCollateralDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const collateralData = {
          type: response.data.value.collateral,
          value: response.data.value.quantity,
        };
        this.totalCollateralValue += collateralData.type.pctToBase * collateralData.type.basePrice * collateralData.value / 100;
        this.collateralDataSource = this.collateralDataSource.concat(collateralData);
        this.collateralOptions = this.collateralOptions.filter((user: any) => user.collateralId !== response.data.value.collateral.collateralId);
        if (this.loanPrincipal < this.totalCollateralValue) {
          this.isCollateralSufficient = true;
        } else {
          this.isCollateralSufficient = false;
        }
      }
    });
  }

  /**
   * Delete a added collateral from loan
   * @param id ID od the collateral to be deleted
   */
  deleteCollateral(id: any) {
    const deleteCollateralDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {deleteContext: `collateral`}
    });
    deleteCollateralDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        const removed: any = this.collateralDataSource.splice(id, 1);
        this.collateralOptions = this.collateralOptions.concat(removed[0].type);
        this.totalCollateralValue -= removed[0].type.pctToBase * removed[0].type.basePrice * removed[0].value / 100;
        this.collateralDataSource = this.collateralDataSource.concat([]);
        this.pristine = false;
        if (this.loanPrincipal < this.totalCollateralValue) {
          this.isCollateralSufficient = true;
        } else {
          this.isCollateralSufficient = false;
        }
      }
    });
  }

  /**
   * Sets all select dropdown options.
   */
  setOptions() {
    this.termFrequencyTypeData = this.loansAccountProductTemplate.termFrequencyTypeOptions;
    this.repaymentFrequencyNthDayTypeData = this.loansAccountProductTemplate.repaymentFrequencyNthDayTypeOptions;
    this.repaymentFrequencyDaysOfWeekTypeData = this.loansAccountProductTemplate.repaymentFrequencyDaysOfWeekTypeOptions;
    this.interestTypeData = this.loansAccountProductTemplate.interestTypeOptions;
    this.amortizationTypeData = this.loansAccountProductTemplate.amortizationTypeOptions;
    this.interestCalculationPeriodTypeData = this.loansAccountProductTemplate.interestCalculationPeriodTypeOptions;
    this.clientActiveLoanData = this.loansAccountProductTemplate.clientActiveLoanOptions;
    this.loanScheduleType = this.loansAccountProductTemplate.loanScheduleType;
    this.transactionProcessingStrategyOptions = [];
    if (this.loanScheduleType.code === LoanProducts.LOAN_SCHEDULE_TYPE_CUMULATIVE) {
      // Filter Advanced Payment Allocation Strategy
      this.transactionProcessingStrategyOptions = this.loansAccountProductTemplate.transactionProcessingStrategyOptions.filter(
        (cn: CodeName) => !LoanProducts.isAdvancedPaymentAllocationStrategy(cn.code)
      );
      this.repaymentStrategyDisabled = false;
    } else {
      // Only Advanced Payment Allocation Strategy
      this.loansAccountProductTemplate.transactionProcessingStrategyOptions.some(
        (cn: CodeName) => {
          if (LoanProducts.isAdvancedPaymentAllocationStrategy(cn.code)) {
            this.transactionProcessingStrategyOptions.push(cn);
          }
        });
      this.repaymentStrategyDisabled = true;
    }
  }

  /**
   * Returns loans account terms form value.
   */
  get loansAccountTerms() {
    return this.loansAccountTermsForm.getRawValue();
  }

  get loanCollateral() {
    return {
      collateral: this.collateralDataSource
    };
  }

  isProductTypeSuEmpresas(): boolean {
    let showDiscountField = false;
    let productType = '';
    const expectedProductType = 'SU+ Empresas';
    if (this.loansAccountTermsData && this.loansAccountTermsData?.product && this.loansAccountTermsData?.product?.productType) {
      productType = this.loansAccountTermsData?.product?.productType?.name;
      showDiscountField = productType === expectedProductType;
      if (!showDiscountField) {
        productType = (this.loansAccountProductTemplate?.product?.productType?.name);
        if (productType === expectedProductType) {
          showDiscountField = true;
        } else {
          this.loansAccountTermsForm.get('valorDescuento').clearValidators();
          this.loansAccountTermsForm.get('valorDescuento').updateValueAndValidity();
        }

      }
    }
    return showDiscountField;
  }

  calculateValorGiro() {
    const principalAmount = this.loansAccountTermsForm.get('principalAmount').value;
    let valorDescuento = this.loansAccountTermsForm.get('valorDescuento')?.value;
    // check that valorDescuento is not undefined or null
    valorDescuento = valorDescuento ? valorDescuento : 0;
    let valorGiro = principalAmount - valorDescuento;
    if (valorGiro < 0) {
      valorGiro = 0;
      valorDescuento = principalAmount;
    }
    this.loansAccountTermsForm.patchValue({valorGiro: valorGiro});
    this.loansAccountTermsForm.patchValue({valorDescuento: valorDescuento});
    this.loansAccountTermsForm.patchValue({principalAmount: principalAmount});
  }

  onLoanIdToCloseChange(loanId: string | number) {
    const foreclosureData = {
      command: 'foreclosure',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
      transactionDate: new Date().toISOString().split('T')[0] // Current date in 'YYYY-MM-DD' format
    };

    this.loansService.getForeclosureData(loanId, foreclosureData).subscribe(
      (response: any) => {
        if (response && response.amount) {
          this.loansAccountTermsForm.patchValue({
            principalAmount: response.amount
          });
        } else {
          console.warn('Foreclosure amount not found in API response');
        }
      },
      error => {
        console.error('Error fetching foreclosure details:', error);
      }
    );
  }
}
