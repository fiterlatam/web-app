/** Angular Imports */
import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

/** Custom Services */
import {ProductsService} from '../../products.service';
import {SettingsService} from 'app/settings/settings.service';
import {SystemService} from 'app/system/system.service';
import {Dates} from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';

/**
 * Create charge component.
 */
@Component({
  selector: 'mifosx-create-charge',
  templateUrl: './create-charge.component.html',
  styleUrls: ['./create-charge.component.scss']
})
export class CreateChargeComponent implements OnInit {

  showAnotherChargeCombobox = false;

  /** Charge form. */
  chargeForm: UntypedFormGroup;
  /** Charges template data. */
  chargesTemplateData: any;
  /** Charge time type data. */
  chargeTimeTypeData: any;
  /** Charge calculation type data. */
  chargeCalculationTypeData: any = [];

  parentChargeDataList: any = [];
  chargeFromTableList: any = [];
  chargeFromExternalCalculationList: any = [];
  interestRateOptions: any = [];
  glAccountsList: any = [];

  /** Charge calculation type data. */
  originalChargeCalculationTypeData: any = [];

  chargeCalculationTypeFilter: any;
  chargeCalculationTypeFilterFlat = false;
  chargeCalculationTypeFilterDisbursal = false;
  chargeCalculationTypeFilterAmount = false;
  chargeCalculationTypeFilterInterest = false;
  chargeCalculationTypeFilterOutstandingAmount = false;
  chargeCalculationTypeFilterOutstandingInterest = false;
  chargeCalculationTypeFilterInsurance = false;
  chargeCalculationTypeFilterInsuranceType = false;
  chargeCalculationTypeFilterAval = false;
  chargeCalculationTypeFilterHonorarios = false;
  chargeCalculationTypeFilterTerm = false;


  /** Income and liability account data */
  incomeAndLiabilityAccountData: any;
  /** Minimum due date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum due date allowed. */
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  /** Repeat every label */
  repeatEveryLabel: string;

  /** Currency decimal places */
  currencyDecimalPlaces: number;

  showVoluntaryInsuranceError = false;
  voluntaryInsuranceErrorCode: string;


  /**
   * Retrieves the charges template data and income and liability account data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ProductsService} productsService Products Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {Dates} dateUtils Date Utils to format date.
   * @param {SettingsService} settingsService Settings Service
   * @param {SystemService} systemService System Service
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private settingsService: SettingsService,
              private decimalPipe: DecimalPipe,
              private systemService: SystemService) {
    this.route.data.subscribe((data: { chargesTemplate: any }) => {
      this.chargesTemplateData = data.chargesTemplate;
      if (data.chargesTemplate.incomeOrLiabilityAccountOptions.liabilityAccountOptions) {
        this.incomeAndLiabilityAccountData = data.chargesTemplate.incomeOrLiabilityAccountOptions.incomeAccountOptions
          .concat(data.chargesTemplate.incomeOrLiabilityAccountOptions.liabilityAccountOptions);
      } else {
        this.incomeAndLiabilityAccountData = data.chargesTemplate.incomeOrLiabilityAccountOptions.incomeAccountOptions;
      }
      if (data.chargesTemplate.glAccounts) {
        this.glAccountsList = data.chargesTemplate.glAccounts;
      }
    });
  }

  /**
   * Creates and sets the charge form.
   */
  ngOnInit() {
    this.createChargeForm();
    this.setChargeForm();
    this.setConditionalControls();

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
   * Creates the charge form.
   */
  createChargeForm() {
    this.chargeForm = this.formBuilder.group({
      'chargeAppliesTo': ['', Validators.required],
      'name': ['', Validators.required],
      'currencyCode': ['', Validators.required],
      'chargeTimeType': ['', Validators.required],
      'chargeCalculationType': ['', Validators.required],
      'amount': ['', this.getAmountValidators()],
      'active': [false],
      'penalty': [false],
      'getPercentageAmountFromTable': [false],
      'taxGroupId': [''],
      'incomeAccountId': [''],
      'minCap': [''],
      'maxCap': [''],
      'graceOnChargePeriodAmount': ['0', [Validators.required, Validators.min(0)]],
      'insuranceName': [''],
      'insuranceChargedAs': [''],
      'insuranceCompany': [''],
      'insurerName': [''],
      'insuranceCode': [''],
      'insurancePlan': [''],
      'baseValue': ['0'],
      'vatValue': ['0'],
      'totalValue': [''],
      'deadline': [''],
      'daysInArrears': [0],
      'chargeCalculationTypeFilterFlat': [false],
      'chargeCalculationTypeFilterDisbursal': [false],
      'chargeCalculationTypeFilterAmount': [false],
      'chargeCalculationTypeFilterInterest': [false],
      'chargeCalculationTypeFilterOutstandingAmount': [false],
      'chargeCalculationTypeFilterOutstandingInterest': [false],
      'chargeCalculationTypeFilterInsurance': [false],
      'chargeCalculationTypeFilterInsuranceType': [false],
      'chargeCalculationTypeFilterAval': [false],
      'chargeCalculationTypeFilterHonorarios': [false],
      'chargeCalculationTypeFilterTerm': [false],
      'parentChargeId': ['', Validators.required],
      'interestRateId': [''],
    });
    this.chargeForm.updateValueAndValidity();
  }

  /**
   * Sets the charge calculation type and charge time type data
   */
  setChargeForm() {
    this.chargeForm.get('chargeAppliesTo').valueChanges.subscribe((chargeAppliesTo) => {
      switch (chargeAppliesTo) {
        case 1:
          this.chargeCalculationTypeData = this.chargesTemplateData.loanChargeCalculationTypeOptions;
          this.chargeTimeTypeData = this.chargesTemplateData.loanChargeTimeTypeOptions;
          break;
        case 2:
          this.chargeCalculationTypeData = this.chargesTemplateData.savingsChargeCalculationTypeOptions;
          this.chargeTimeTypeData = this.chargesTemplateData.savingsChargeTimeTypeOptions;
          break;
        case 3:
          this.chargeCalculationTypeData = this.chargesTemplateData.clientChargeCalculationTypeOptions;
          this.chargeTimeTypeData = this.chargesTemplateData.clientChargeTimeTypeOptions;
          break;
        case 4:
          this.chargeCalculationTypeData = this.chargesTemplateData.shareChargeCalculationTypeOptions;
          this.chargeTimeTypeData = this.chargesTemplateData.shareChargeTimeTypeOptions;
          break;
      }
    });

    this.originalChargeCalculationTypeData = this.chargesTemplateData.loanChargeCalculationTypeOptions;
    this.parentChargeDataList = this.chargesTemplateData.chargeDataList;
    this.chargeFromTableList = this.chargesTemplateData.chargeFromTableList;
    this.chargeFromExternalCalculationList = this.chargesTemplateData.chargeFromExternalCalculationList;
    this.interestRateOptions = this.chargesTemplateData.interestRateOptions;
    this.glAccountsList = this.chargesTemplateData.glAccounts;
  }

  /**
   * @returns {any} Filtered charge calculation type data.
   */
  filteredChargeCalculationType(): any {
    return this.chargeCalculationTypeData.filter((chargeCalculationType: any) => {
      if (this.chargeForm.get('chargeTimeType').value === 12 && (chargeCalculationType.id === 3 || chargeCalculationType.id === 4)) {
        return false;
      }
      if (this.chargeForm.get('chargeTimeType').value !== 12 && chargeCalculationType.id === 5) {
        return false;
      }
      if (this.chargeForm.get('chargeAppliesTo').value === 2) {
        if (!(this.chargeForm.get('chargeTimeType').value === 5 || this.chargeForm.get('chargeTimeType').value === 16
          || this.chargeForm.get('chargeTimeType').value === 17) && chargeCalculationType.id === 2) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Sets the conditional controls of the user form
   */
  setConditionalControls() {
    this.chargeForm.get('chargeAppliesTo').valueChanges.subscribe((chargeAppliesTo) => {
      this.chargeForm.get('penalty').enable();

      this.chargeForm.removeControl('graceOnChargePeriodAmount');
      this.chargeForm.removeControl('graceOnChargePeriodEnum');

      this.chargeForm.removeControl('chargeCalculationTypeFilterFlat');
      this.chargeForm.removeControl('chargeCalculationTypeFilterDisbursal');
      this.chargeForm.removeControl('chargeCalculationTypeFilterAmount');
      this.chargeForm.removeControl('chargeCalculationTypeFilterInterest');
      this.chargeForm.removeControl('chargeCalculationTypeFilterOutstandingAmount');
      this.chargeForm.removeControl('chargeCalculationTypeFilterOutstandingInterest');
      this.chargeForm.removeControl('chargeCalculationTypeFilterInsurance');
      this.chargeForm.removeControl('chargeCalculationTypeFilterInsuranceType');
      this.chargeForm.removeControl('chargeCalculationTypeFilterAval');
      this.chargeForm.removeControl('chargeCalculationTypeFilterHonorarios');
      this.chargeForm.removeControl('chargeCalculationTypeFilterTerm');

      this.chargeForm.removeControl('parentChargeId');
      this.chargeForm.removeControl('customChargeId');
      this.chargeForm.removeControl('externalCalculationChargeId');


      switch (chargeAppliesTo) {
        case 1: // Loan
          this.chargeForm.addControl('chargePaymentMode', new UntypedFormControl('', Validators.required));
          this.chargeForm.removeControl('incomeAccountId');

          this.chargeForm.addControl('graceOnChargePeriodAmount', new UntypedFormControl('0', [Validators.required, Validators.min(0)]));
          this.chargeForm.addControl('graceOnChargePeriodEnum', new UntypedFormControl('days', Validators.required));


          this.chargeForm.addControl('chargeCalculationTypeFilterFlat', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterDisbursal', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterAmount', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterInterest', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterOutstandingAmount', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterOutstandingInterest', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterInsurance', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterInsuranceType', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterAval', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterHonorarios', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterTerm', new UntypedFormControl(false));

          this.chargeForm.addControl('parentChargeId', new UntypedFormControl(false, Validators.required));
          this.chargeForm.addControl('customChargeId', new UntypedFormControl(false));
          this.chargeForm.addControl('externalCalculationChargeId', new UntypedFormControl(false));
          this.chargeForm.addControl('getPercentageAmountFromTable', new UntypedFormControl(false));
          break;
        case 2: // Savings
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.removeControl('incomeAccountId');
          this.chargeForm.removeControl('getPercentageAmountFromTable');

          break;
        case 3: // Client
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.addControl('incomeAccountId', new UntypedFormControl(''));
          this.chargeForm.removeControl('getPercentageAmountFromTable');
          break;
        case 4: // Shares
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.removeControl('incomeAccountId');
          this.chargeForm.get('penalty').setValue(false);
          this.chargeForm.removeControl('getPercentageAmountFromTable');
          break;
      }
      this.chargeForm.get('chargeCalculationType').reset();
      this.chargeForm.get('chargeTimeType').reset();
    });
    this.chargeForm.get('chargeTimeType').valueChanges.subscribe((chargeTimeType) => {
      this.chargeForm.removeControl('feeFrequency');
      this.chargeForm.removeControl('feeInterval');
      this.chargeForm.removeControl('feeOnMonthDay');
      this.chargeForm.removeControl('addFeeFrequency');
      if (this.chargeForm.get('chargeAppliesTo').value !== 4) {
        this.chargeForm.get('penalty').enable();
      }
      switch (chargeTimeType) {
        case 6: // Annual Fee
          this.chargeForm.addControl('feeOnMonthDay', new UntypedFormControl('', Validators.required));
          break;
        case 7: // Monthly Fee
          this.chargeForm.addControl('feeOnMonthDay', new UntypedFormControl(''));
          this.chargeForm.addControl('feeInterval', new UntypedFormControl('', [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern('^[1-9]\\d*$')]));
          this.repeatEveryLabel = 'Months';
          break;
        case 9: // Overdue Fee
          this.chargeForm.get('penalty').setValue(true);
          this.chargeForm.addControl('addFeeFrequency', new UntypedFormControl(false));
          this.chargeForm.get('addFeeFrequency').valueChanges.subscribe((addFeeFrequency) => {
            if (addFeeFrequency) {
              this.chargeForm.addControl('feeFrequency', new UntypedFormControl('', Validators.required));
              this.chargeForm.addControl('feeInterval', new UntypedFormControl('', [Validators.required, Validators.pattern('^[1-9]\\d*$')]));
            } else {
              this.chargeForm.removeControl('feeFrequency');
              this.chargeForm.removeControl('feeInterval');
            }
          });
          break;
        case 11: // Weekly Fee
          this.chargeForm.addControl('feeInterval', new UntypedFormControl('', [Validators.required, Validators.pattern('^[1-9]\\d*$')]));
          this.repeatEveryLabel = 'Weeks';
          break;
      }
    });
  }

  /**
   * Submits the charge form and creates charge,
   * if successful redirects to charges.
   */
  submit() {
    const chargeFormData = this.chargeForm.value;
    const locale = this.settingsService.language.code;
    const prevFeeOnMonthDay: Date = this.chargeForm.value.feeOnMonthDay;
    const monthDayFormat = 'dd MMM';
    if (chargeFormData.feeOnMonthDay instanceof Date) {
      chargeFormData.feeOnMonthDay = this.dateUtils.formatDate(prevFeeOnMonthDay, monthDayFormat);
    }
    if (locale === 'es' && chargeFormData.amount) {
      chargeFormData.amount = chargeFormData.amount.replace(/\./g, '');
    }
    const data = {
      ...chargeFormData,
      monthDayFormat,
      locale
    };
    delete data.addFeeFrequency;
    if (!data.taxGroupId) {
      delete data.taxGroupId;
    }
    if (!data.minCap) {
      delete data.minCap;
    }
    if (!data.maxCap) {
      delete data.maxCap;
    }
    if (!data.glAccountId) {
      delete data.glAccountId;
    }

    delete data.chargeCalculationTypeFilterFlat;
    delete data.chargeCalculationTypeFilterDisbursal;
    delete data.chargeCalculationTypeFilterAmount;
    delete data.chargeCalculationTypeFilterInterest;
    delete data.chargeCalculationTypeFilterOutstandingAmount;
    delete data.chargeCalculationTypeFilterOutstandingInterest;
    delete data.chargeCalculationTypeFilterInsurance;
    delete data.chargeCalculationTypeFilterInsuranceType;
    delete data.chargeCalculationTypeFilterAval;
    delete data.chargeCalculationTypeFilterHonorarios;
    delete data.chargeCalculationTypeFilterTerm;

    delete data.customChargeId;
    delete data.externalCalculationChargeId;

    if (this.chargeForm.value.chargeCalculationTypeFilterTerm == false) {
      delete data.parentChargeId;
    }

    this.productsService.createCharge(data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }

  enableOrDisableCupoMaxSellField(itemName: String, selected: boolean) {
    this.chargeCalculationTypeData = [];
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
      if (this.chargeForm.get('parentChargeId') == null) {
        this.chargeForm.addControl('parentChargeId', new UntypedFormControl(false, Validators.required));
      }
      this.chargeForm.get('parentChargeId').setValidators([Validators.required]);
    } else {

      this.chargeForm.removeControl('parentChargeId');
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
        this.chargeCalculationTypeData.push(this.originalChargeCalculationTypeData[index]);
      }
    } else {
      this.lookForKeyOnCode(lookForWordsArray);
    }

    if (isFilterApplied) {
      if (this.chargeCalculationTypeData.length === 1) {
        this.chargeForm.get('chargeCalculationType').setValue(this.chargeCalculationTypeData[0].id);
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
      if (this.chargeCalculationTypeData.includes(this.originalChargeCalculationTypeData[index])) {
        return;
      }
      const currCode = this.originalChargeCalculationTypeData[index].value;
        if (currCode === lookupCode) {
          this.chargeCalculationTypeData.push(this.originalChargeCalculationTypeData[index]);
          break;
        }
    }
  }

  shouldDisplayInsuranceFields(insuranceType: string): boolean {
    const formValues = this.chargeForm.value;
    if (this.chargeForm.get('penalty').value) {
      return false;
    }
    switch (insuranceType) {
      case 'mandatory':
        return formValues.chargeAppliesTo === 1 && formValues.chargeCalculationTypeFilterInsurance;
      case 'optional':
        return formValues.chargeAppliesTo === 1 && formValues.chargeCalculationTypeFilterInsuranceType;
      case 'all':
        return formValues.chargeAppliesTo === 1 &&
          (formValues.chargeCalculationTypeFilterInsuranceType || formValues.chargeCalculationTypeFilterInsurance);
    }

    return formValues.chargeAppliesTo === 1 &&
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
      const vatValue =  this.chargeForm.get('vatValue').value;
      let sum = parseFloat(baseValue) + parseFloat(vatValue);
      sum = Math.round(sum);

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
