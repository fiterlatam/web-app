/** Angular Imports */
import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

/** Custom Services */
import {ProductsService} from 'app/products/products.service';
import {SettingsService} from 'app/settings/settings.service';
import {DecimalPipe} from '@angular/common';
import { SystemService } from 'app/system/system.service';


/**
 * Edit Charge component.
 */
@Component({
  selector: 'mifosx-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.scss']
})
export class EditChargeComponent implements OnInit {
  showAnotherChargeCombobox = false;
  /** Selected Data. */
  chargeData: any;
  /** Charge form. */
  chargeForm: UntypedFormGroup;
  /** Charge Time Type options. */
  chargeTimeTypeOptions: any;
  /** Charge Calculation Type options. */
  chargeCalculationTypeOptions: any;
  /** Show Penalty. */
  showPenalty = true;
  /** Add Fee Frequency. */
  addFeeFrequency = true;
  /** Show GL Accounts. */
  showGLAccount = false;
  /** Charge Payment Mode. */
  chargePaymentMode = false;
  /** Show Fee Options. */
  showFeeOptions = false;

  parentChargeDataList: any = [];
  assetAGLAccounts: any = [];
  chargeFromTableList: any = [];
  chargeFromExternalCalculationList: any = [];
  interestRateOptions: any = [];

  /** Charge calculation type data. */
  originalChargeCalculationTypeData: any = [];
  chargeCalculationTypeFilterFlat = false;
  chargeCalculationTypeFilterDisbursal = false;
  chargeCalculationTypeFilterAmount = false;
  chargeCalculationTypeFilterInterest = false;
  chargeCalculationTypeFilterOutstandingAmount = false;
  chargeCalculationTypeFilterOutstandingInterest = false;
  chargeCalculationTypeFilterInsurance = false;
  chargeCalculationTypeFilterAval = false;
  chargeCalculationTypeFilterHonorarios = false;
  chargeCalculationTypeFilterTerm = false;

  showVoluntaryInsuranceError = false;
  voluntaryInsuranceErrorCode: string;


  /**
   * Retrieves the charge data from `resolve`.
   * @param {ProductsService} productsService Products Service.
   * @param formBuilder
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private productsService: ProductsService,
              private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { chargesTemplate: any }) => {
      this.chargeData = data.chargesTemplate;
      this.parentChargeDataList = this.chargeData['chargeDataList'];
      this.interestRateOptions = this.chargeData.interestRateOptions;
      this.assetAGLAccounts = this.chargeData.glAccounts;
    });
  }

  setupFiltersCheckboxes() {
    const selectedCalculationTypeCode = this.chargeData.chargeCalculationType.code;

    if (selectedCalculationTypeCode.indexOf('flat') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterFlat').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('disbursedamount') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterDisbursal').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('installmentprincipal') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterAmount').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('installmentinterest') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInterest').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('outstandingprincipal') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterOutstandingAmount').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('outstandinginterest') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterOutstandingInterest').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('seguroobrigatorio') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInsurance').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('aval') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterAval').setValue(true);
    }


    if (selectedCalculationTypeCode.indexOf('honorarios') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterHonorarios').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('percentofanothercharge') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterTerm').setValue(true);
    }

    if (selectedCalculationTypeCode.indexOf('segurovoluntarioasistencia') !== -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInsuranceType').setValue(true);
    }
  }

  ngOnInit() {
    this.editChargeForm();
    this.setupFiltersCheckboxes();

  }

  getAmountValidators(): any[] {
    const locale = this.settingsService.language.code;
    const amountValidators = [Validators.required];
    if (locale === 'es') {
      amountValidators.push(Validators.pattern(/^(?!(?:\D*\d){15})([0-9]){1,9}(?:,\d{1,8})?$/));
    } else if (locale === 'en') {
      amountValidators.push(Validators.pattern(/^(?!(?:\D*\d){15})([0-9]){1,9}(?:\.\d{1,8})?$/));
    } else {
      amountValidators.push(Validators.pattern(/^[0-9.,]*$/));
    }
    return amountValidators;
  }

  /**
   * Edit Charge form.
   */
  editChargeForm() {
    this.initializeForm();
    this.removeUnusedControls();
    this.setupChargeSpecificControls();
    this.setupTaxGroup();
  }

  private initializeForm() {
    this.showFeeOptions = (this.chargeData.feeInterval && this.chargeData.feeInterval > 0);
    const voluntaryInsuranceData = this.chargeData.chargeInsuranceDetailData;
    const incomeOrLiabilityAccount = this.chargeData.incomeOrLiabilityAccount;

    this.chargeForm = this.formBuilder.group({
      'name': [this.chargeData.name, Validators.required],
      'chargeAppliesTo': [{value: this.chargeData.chargeAppliesTo.id, disabled: true}, Validators.required],
      'currencyCode': [this.chargeData.currency.code, Validators.required],
      'amount': [this.replaceCharactersFromAmount(this.chargeData.amount), this.getAmountValidators()],
      'active': [this.chargeData.active],
      'interestRateId': [this.chargeData.interestRate ? this.chargeData.interestRate.id : ''],
      'penalty': [this.chargeData.penalty],
      'minCap': [this.chargeData.minCap],
      'maxCap': [this.chargeData.maxCap],
      'chargeTimeType': [this.chargeData.chargeTimeType.id, Validators.required],
      'chargeCalculationType': [this.chargeData.chargeCalculationType.id, Validators.required],
      'incomeAccountId': [incomeOrLiabilityAccount?.id],
      // ... (other form controls)
    });

    this.addInsuranceControls(voluntaryInsuranceData);
  }

  private removeUnusedControls() {
    const controlsToRemove = [
      'graceOnChargePeriodAmount', 'graceOnChargePeriodEnum', 'chargeCalculationTypeFilterFlat',
      'chargeCalculationTypeFilterDisbursal', 'chargeCalculationTypeFilterAmount',
      'chargeCalculationTypeFilterInterest', 'chargeCalculationTypeFilterOutstandingAmount',
      'chargeCalculationTypeFilterOutstandingInterest', 'chargeCalculationTypeFilterInsurance',
      'chargeCalculationTypeFilterAval', 'chargeCalculationTypeFilterHonorarios',
      'chargeCalculationTypeFilterTerm', 'parentChargeId', 'customChargeId',
      'externalCalculationChargeId', 'chargeCalculationTypeFilterInsuranceType',
      'getPercentageAmountFromTable'
    ];

    controlsToRemove.forEach(control => this.chargeForm.removeControl(control));
  }
  private addLoanSpecificControls() {
    const controls = [
      { name: 'chargePaymentMode', value: this.chargeData.chargePaymentMode.id, validators: [Validators.required] },
      { name: 'graceOnChargePeriodAmount', value: this.chargeData.graceOnChargePeriodAmount, validators: [Validators.required, Validators.min(0)] },
      { name: 'chargeCalculationTypeFilterFlat', value: false },
      { name: 'chargeCalculationTypeFilterDisbursal', value: false },
      { name: 'chargeCalculationTypeFilterAmount', value: false },
      { name: 'chargeCalculationTypeFilterInterest', value: false },
      { name: 'chargeCalculationTypeFilterOutstandingAmount', value: false },
      { name: 'chargeCalculationTypeFilterOutstandingInterest', value: false },
      { name: 'chargeCalculationTypeFilterInsurance', value: false },
      { name: 'chargeCalculationTypeFilterAval', value: false },
      { name: 'chargeCalculationTypeFilterHonorarios', value: false },
      { name: 'chargeCalculationTypeFilterTerm', value: false },
      { name: 'parentChargeId', value: this.chargeData.parentChargeId },
      { name: 'customChargeId', value: false },
      { name: 'externalCalculationChargeId', value: false },
      { name: 'chargeCalculationTypeFilterInsuranceType', value: false },
      { name: 'getPercentageAmountFromTable', value: this.chargeData.getPercentageAmountFromTable }
    ];

    controls.forEach(control => {
      this.chargeForm.addControl(control.name, this.formBuilder.control(control.value, control.validators));
    });

    this.originalChargeCalculationTypeData = this.chargeData.loanChargeCalculationTypeOptions;
  }

  private setupChargeSpecificControls() {
    const chargeAppliesTo = this.chargeData.chargeAppliesTo.value;

    switch (chargeAppliesTo) {
      case 'Loan':
        this.setupLoanChargeControls();
        break;
      case 'Savings':
        this.setupSavingsChargeControls();
        break;
      case 'Shares':
        this.setupSharesChargeControls();
        break;
      default:
        this.setupClientChargeControls();
    }
  }

  private setupLoanChargeControls() {
    this.chargeTimeTypeOptions = this.chargeData.loanChargeTimeTypeOptions;
    this.chargeCalculationTypeOptions = this.chargeData.loanChargeCalculationTypeOptions;
    this.addFeeFrequency = true;
    this.chargePaymentMode = true;

    this.addLoanSpecificControls();
    this.setupFeeOptions();
  }
  private setupFeeOptions() {
    if (this.showFeeOptions) {
      this.getFeeFrequency(this.showFeeOptions);
      this.chargeForm.patchValue({
        'feeInterval': this.chargeData.feeInterval,
        'feeFrequency': this.chargeData.feeFrequency.id
      });
    }
  }

  private setupSavingsChargeControls() {
    this.chargeTimeTypeOptions = this.chargeData.savingsChargeTimeTypeOptions;
    this.chargeCalculationTypeOptions = this.chargeData.savingsChargeCalculationTypeOptions;
    this.addFeeFrequency = false;
    this.chargeForm.removeControl('getPercentageAmountFromTable');
  }

  private setupSharesChargeControls() {
    this.chargeTimeTypeOptions = this.chargeData.shareChargeTimeTypeOptions;
    this.chargeCalculationTypeOptions = this.chargeData.shareChargeCalculationTypeOptions;
    this.addFeeFrequency = false;
    this.showGLAccount = false;
    this.showPenalty = false;
    this.chargeForm.removeControl('getPercentageAmountFromTable');
  }

  private setupClientChargeControls() {
    this.chargeCalculationTypeOptions = this.chargeData.clientChargeCalculationTypeOptions;
    this.chargeTimeTypeOptions = this.chargeData.clientChargeTimeTypeOptions;
    this.showGLAccount = true;
    this.addFeeFrequency = false;
    this.chargeForm.addControl('incomeAccountId', this.formBuilder.control(this.chargeData.incomeOrLiabilityAccount.id, Validators.required));
    this.chargeForm.removeControl('getPercentageAmountFromTable');
  }

  private setupTaxGroup() {
    if (this.chargeData.taxGroup) {
      this.chargeForm.addControl('taxGroupId', this.formBuilder.control({
        value: this.chargeData.taxGroup.id,
        disabled: true
      }));
    } else {
      this.chargeForm.addControl('taxGroupId', this.formBuilder.control({value: ''}));
    }
  }

// ... (other helper methods)

  /**
   * Get Add Fee Frequency value.
   */
  getFeeFrequency(isChecked: boolean) {
    this.showFeeOptions = isChecked;
    if (isChecked) {
      this.chargeForm.addControl('feeInterval', this.formBuilder.control('', Validators.required));
      this.chargeForm.addControl('feeFrequency', this.formBuilder.control('', Validators.required));
    } else {
      this.chargeForm.removeControl('feeInterval');
      this.chargeForm.removeControl('feeFrequency');
    }
  }

  /**
   * Submits Edit Charge form.
   */
  submit() {
    const charges = this.chargeForm.getRawValue();
    const locale = this.settingsService.language.code;
    charges.locale = locale;
    if (locale === 'es' && charges.amount) {
      charges.amount = charges.amount.replace(/\./g, '');
    }
    if (charges.taxGroupId.value === '') {
      delete charges.taxGroupId;
    }
    if (!charges.minCap) {
      delete charges.minCap;
    }
    if (!charges.maxCap) {
      delete charges.maxCap;
    }
    if (!charges.interestRateId) {
      charges.interestRateId = 0;
    }

    delete charges.chargeCalculationTypeFilterFlat;
    delete charges.chargeCalculationTypeFilterDisbursal;
    delete charges.chargeCalculationTypeFilterAmount;
    delete charges.chargeCalculationTypeFilterInterest;
    delete charges.chargeCalculationTypeFilterOutstandingAmount;
    delete charges.chargeCalculationTypeFilterOutstandingInterest;
    delete charges.chargeCalculationTypeFilterInsurance;
    delete charges.chargeCalculationTypeFilterAval;
    delete charges.chargeCalculationTypeFilterHonorarios;
    delete charges.chargeCalculationTypeFilterTerm;
    delete charges.chargeCalculationTypeFilterInsuranceType;

    delete charges.customChargeId;
    delete charges.externalCalculationChargeId;

    this.productsService.updateCharge(this.chargeData.id.toString(), charges)
      .subscribe((response: any) => {
        this.router.navigate(['../'], {relativeTo: this.route});
      });
  }


  enableOrDisableCupoMaxSellField(itemName: String, selected: boolean) {
    this.chargeCalculationTypeOptions = [];
    const lookForWordsArray: any = [];
    let isFilterApplied = false;

    if (this.chargeForm.value.chargeCalculationTypeFilterFlat) {
      lookForWordsArray.push('flat');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterDisbursal) {
      lookForWordsArray.push('disbursedamount');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterAmount) {
      lookForWordsArray.push('installmentprincipal');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterInterest) {
      lookForWordsArray.push('installmentinterest');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterOutstandingAmount) {
      lookForWordsArray.push('outstandingprincipal');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterOutstandingInterest) {
      lookForWordsArray.push('outstandinginterest');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterInsurance) {
      lookForWordsArray.push('seguroobrigatorio');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterAval) {
      lookForWordsArray.push('aval');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterHonorarios) {
      lookForWordsArray.push('honorarios');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterTerm) {
      lookForWordsArray.push('percentofanothercharge');
      isFilterApplied = true;
      this.showAnotherChargeCombobox = true;
    } else {
      this.showAnotherChargeCombobox = false;
    }
    if (this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      lookForWordsArray.push('segurovoluntarioasistencia');
      isFilterApplied = true;
    }

    if (!this.chargeForm.get('penalty').value && this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      if (!this.chargeForm.value.chargeCalculationTypeFilterFlat || lookForWordsArray.length > 2) {
        this.showVoluntaryInsuranceError = true;
        this.voluntaryInsuranceErrorCode = 'error.msg.only.flat.type.allowed.for.voluntary.insurance';
        return;
      } else {
        this.showVoluntaryInsuranceError = false;
        this.voluntaryInsuranceErrorCode = '';
      }
    } else {
      this.showVoluntaryInsuranceError = false;
              this.voluntaryInsuranceErrorCode = '';
    }
    // IOf nothing selected, restore the list
    if (lookForWordsArray.length === 0) {
      for (let index = 0; index <= this.originalChargeCalculationTypeData.length - 1; index++) {
        this.chargeCalculationTypeOptions.push(this.originalChargeCalculationTypeData[index]);
      }
    } else {
      this.lookForKeyOnCode(lookForWordsArray);
    }

    if (isFilterApplied) {
      if (this.chargeCalculationTypeOptions.length === 1) {
        this.chargeForm.get('chargeCalculationType').setValue(this.chargeCalculationTypeOptions[0].id);
      } else {
        this.chargeForm.get('chargeCalculationType').setValue(null);
      }
    }
  }

  lookForKeyOnCode(lookForWordsArray: any = []) {
    let lookupCode = "";
    for (let i = 0; i < lookForWordsArray.length; i++) {
      if (i === 0) {
        lookupCode = lookForWordsArray[i];
      } else {
          lookupCode = lookupCode + "." + lookForWordsArray[i];
      }
    }
    for (let index = 0; index <= this.originalChargeCalculationTypeData.length - 1; index++) {
      if (this.chargeCalculationTypeOptions.includes(this.originalChargeCalculationTypeData[index])) {
        return;
      }
      const currCode = this.originalChargeCalculationTypeData[index].value;
        if (currCode === lookupCode) {
          this.chargeCalculationTypeOptions.push(this.originalChargeCalculationTypeData[index]);
          break;
        }
    }
  }

  shouldDisplayInsuranceFields(insuranceType: string): boolean {
    const formValues = this.chargeForm.value;
    if (this.chargeForm.get('penalty').value) {
      return false;
    }
    const chargesAppliedTo = this.chargeForm.controls.chargeAppliesTo.value;
    switch (insuranceType) {
      case 'mandatory':
        return chargesAppliedTo === 1 && formValues.chargeCalculationTypeFilterInsurance;
      case 'optional':
        return chargesAppliedTo === 1 && formValues.chargeCalculationTypeFilterInsuranceType;
      case 'all':
        return chargesAppliedTo === 1 &&
          (formValues.chargeCalculationTypeFilterInsuranceType || formValues.chargeCalculationTypeFilterInsurance);
    }

    return chargesAppliedTo === 1 &&
      (formValues.chargeCalculationTypeFilterInsuranceType || formValues.chargeCalculationTypeFilterInsurance);
  }


  areInsuranceFieldsRequired(): boolean {
    return ((!this.chargeForm.get('penalty').value) && (!this.chargeForm.value.chargeCalculationTypeFilterInsuranceType || this.chargeForm.value.chargeCalculationTypeFilterInsurance));
  }



  disableAmountAndBaseValue() {
    if (!this.chargeForm.get('penalty').value && this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      this.chargeForm.get('baseValue').valueChanges.subscribe(() => this.sumVatAndTotalValues());
      this.chargeForm.get('vatValue').valueChanges.subscribe(() => this.sumVatAndTotalValues());
      return true;
    } else {
      return false;
    }
  }

  sumVatAndTotalValues() {
    if(!this.chargeForm.get('penalty').value && this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      const baseValue = this.chargeForm.get('baseValue').value;
      const vatValue =   this.chargeForm.get('vatValue').value;
      let sum = parseFloat(vatValue) + parseFloat(baseValue);
      sum = Math.round(sum) ;

      this.chargeForm.controls['amount'].setValidators([]);
      this.chargeForm.controls['amount'].setValidators(this.getAmountValidators());
      this.chargeForm.get('amount').updateValueAndValidity();
      if (this.settingsService.language.code === "es") {
        this.chargeForm.get('amount').setValue(this.replaceCharactersFromAmount(sum));
      } else {
        this.chargeForm.get('amount').setValue(sum);
      }
      this.chargeForm.get('totalValue').setValue(sum);
    }
  }

  replaceCharactersFromAmount(amount: any): any {
    if (amount !== undefined && amount !== null) {
    if (this.settingsService.language.code === 'es') {
      amount = amount.toString().replace(/,/g, "");
       return amount = amount.toString().replace(/\./g, ",");
    } else {
      return amount;
      }
  } else {
    return ""
    }
  }
}
