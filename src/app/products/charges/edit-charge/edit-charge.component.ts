/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';


/**
 * Edit Charge component.
 */
@Component({
  selector: 'mifosx-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.scss']
})
export class EditChargeComponent implements OnInit {

  showAnotherChargeCombobox: boolean = false;

  /** Selected Data. */
  chargeData: any;
  /** Charge form. */
  chargeForm: UntypedFormGroup;
  /** Select Income. */
  selectedIncome: any;
  /** Select Time Type. */
  selectedTime: any;
  /** Select Currency Type. */
  selectedCurrency: any;
  /** Select Calculation Type. */
  selectedCalculation: any;
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
  chargeFromTableList: any = [];
  chargeFromExternalCalculationList: any = [];

  /** Charge calculation type data. */
  originalChargeCalculationTypeData: any = [];

  chargeCalculationTypeFilter: any;
  chargeCalculationTypeFilterFlat: boolean = false;
  chargeCalculationTypeFilterDisbursal: boolean = false;
  chargeCalculationTypeFilterAmount: boolean = false;
  chargeCalculationTypeFilterInterest: boolean = false;
  chargeCalculationTypeFilterOutstandingAmount: boolean = false;
  chargeCalculationTypeFilterOutstandingInterest: boolean = false;
  chargeCalculationTypeFilterInsurance: boolean = false;
  chargeCalculationTypeFilterAval: boolean = false;
  chargeCalculationTypeFilterHonorarios: boolean = false;
  chargeCalculationTypeFilterTerm: boolean = false;
  chargeCalculationTypeFilterInsuranceType: boolean = false;

  showVoluntaryInsuranceError = false;
  voluntaryInsuranceErrorCode: string;

  /**
   * Retrieves the charge data from `resolve`.
   * @param {ProductsService} productsService Products Service.
   * @param {FormBuilder} formBuilder Form Builder.
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
      this.parentChargeDataList = this.chargeData.chargeDataList;
    });
  }

  setupFiltersCheckboxes() {
    let selectedCalculationTypeCode = this.chargeData.chargeCalculationType.code;

    if(selectedCalculationTypeCode.indexOf('flat') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterFlat').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('disbursedamount') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterDisbursal').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('installmentprincipal') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterAmount').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('installmentinterest') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInterest').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('outstandingprincipal') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterOutstandingAmount').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('outstandinginterest') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterOutstandingInterest').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('seguroobrigatorio') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInsurance').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('aval') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterAval').setValue(true);
    }


    if(selectedCalculationTypeCode.indexOf('honorarios') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterHonorarios').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('percentofanothercharge') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterTerm').setValue(true);
    }

    if(selectedCalculationTypeCode.indexOf('segurovoluntarioasistencia') != -1) {
      this.chargeForm.get('chargeCalculationTypeFilterInsuranceType').setValue(true);
    }

  }

  ngOnInit() {
    this.editChargeForm();
    this.setupFiltersCheckboxes();
  }

  /**
   * Edit Charge form.
   */
  editChargeForm() {
    this.showFeeOptions = (this.chargeData.feeInterval && this.chargeData.feeInterval > 0);
    const voluntaryInsuranceData = this.chargeData.chargeInsuranceDetailData;
    this.chargeForm = this.formBuilder.group({
      'name': [this.chargeData.name, Validators.required],
      'chargeAppliesTo': [{ value: this.chargeData.chargeAppliesTo.id, disabled: true }, Validators.required],
      'currencyCode': [this.chargeData.currency.code, Validators.required],
      'amount': [this.chargeData.amount, Validators.required],
      'active': [this.chargeData.active],
      'penalty': [this.chargeData.penalty],
      'minCap': [this.chargeData.minCap],
      'maxCap': [this.chargeData.maxCap],
      'chargeTimeType': [this.chargeData.chargeTimeType.id, Validators.required],
      'chargeCalculationType': [this.chargeData.chargeCalculationType.id, Validators.required],
      'graceOnChargePeriodEnum': ['days', Validators.required],
      'chargeCalculationTypeFilterFlat': [false],
      'chargeCalculationTypeFilterDisbursal': [false],
      'chargeCalculationTypeFilterAmount': [false],
      'chargeCalculationTypeFilterInterest': [false],
      'chargeCalculationTypeFilterOutstandingAmount': [false],
      'chargeCalculationTypeFilterOutstandingInterest': [false],
      'chargeCalculationTypeFilterInsurance': [false],
      'chargeCalculationTypeFilterAval': [false],
      'chargeCalculationTypeFilterHonorarios': [false],
      'chargeCalculationTypeFilterTerm': [false],
      'parentChargeId': [this.chargeData.parentChargeId, Validators.required],
      'chargeCalculationTypeFilterInsuranceType': [false],
      'graceOnChargePeriodAmount': ['0'],
      'insuranceName': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insuranceName],
      'insuranceChargedAs': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insuranceChargedAs],
      'insuranceCompany': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insuranceCompany],
      'insurerName': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insurerName],
      'insuranceCode': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insuranceCode],
      'insurancePlan': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.insurancePlan],
      'baseValue': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.baseValue],
      'vatValue': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.vatValue],
      'totalValue': [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.totalValue],
      'deadline':  [voluntaryInsuranceData == null ? null : voluntaryInsuranceData.deadline],
    });

    this.chargeForm.removeControl('graceOnChargePeriodAmount');
    this.chargeForm.removeControl('graceOnChargePeriodEnum');
    this.chargeForm.removeControl('chargeCalculationTypeFilterFlat');
    this.chargeForm.removeControl('chargeCalculationTypeFilterDisbursal');
    this.chargeForm.removeControl('chargeCalculationTypeFilterAmount');
    this.chargeForm.removeControl('chargeCalculationTypeFilterInterest');
    this.chargeForm.removeControl('chargeCalculationTypeFilterOutstandingAmount');
    this.chargeForm.removeControl('chargeCalculationTypeFilterOutstandingInterest');
    this.chargeForm.removeControl('chargeCalculationTypeFilterInsurance');
    this.chargeForm.removeControl('chargeCalculationTypeFilterAval');
    this.chargeForm.removeControl('chargeCalculationTypeFilterHonorarios');
    this.chargeForm.removeControl('chargeCalculationTypeFilterTerm');

    this.chargeForm.removeControl('parentChargeId');
    this.chargeForm.removeControl('customChargeId');
    this.chargeForm.removeControl('externalCalculationChargeId');
    this.chargeForm.removeControl('chargeCalculationTypeFilterInsuranceType');

    switch (this.chargeData.chargeAppliesTo.value) {
      case 'Loan': {
        this.chargeTimeTypeOptions = this.chargeData.loanChargeTimeTypeOptions;
        this.chargeCalculationTypeOptions = this.chargeData.loanChargeCalculationTypeOptions;
        this.addFeeFrequency = true;
        this.chargePaymentMode = true;
        this.chargeForm.addControl('chargePaymentMode', this.formBuilder.control(this.chargeData.chargePaymentMode.id, Validators.required));

        this.chargeForm.addControl('graceOnChargePeriodAmount', this.formBuilder.control(this.chargeData.graceOnChargePeriodAmount, Validators.required));
        this.chargeForm.addControl('chargeCalculationTypeFilterFlat', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterDisbursal', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterAmount', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterInterest', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterOutstandingAmount', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterOutstandingInterest', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterInsurance', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterAval', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterHonorarios', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterTerm', new UntypedFormControl(false));


        this.chargeForm.addControl('parentChargeId', new UntypedFormControl(false));
        this.chargeForm.addControl('customChargeId', new UntypedFormControl(false));
        this.chargeForm.addControl('externalCalculationChargeId', new UntypedFormControl(false));
        this.chargeForm.addControl('chargeCalculationTypeFilterInsuranceType', new UntypedFormControl(false));

        this.originalChargeCalculationTypeData = this.chargeData.loanChargeCalculationTypeOptions;

        this.chargeForm.get('parentChargeId').setValue(this.chargeData.parentChargeId);

        if (this.showFeeOptions) {
          this.getFeeFrequency(this.showFeeOptions);
          this.chargeForm.patchValue({
            'feeInterval': this.chargeData.feeInterval,
            'feeFrequency': this.chargeData.feeFrequency.id
          });
        }
        break;
      }
      case 'Savings': {
        this.chargeTimeTypeOptions = this.chargeData.savingsChargeTimeTypeOptions;
        this.chargeCalculationTypeOptions = this.chargeData.savingsChargeCalculationTypeOptions;
        this.addFeeFrequency = false;
        break;
      }
      case 'Shares': {
        this.chargeTimeTypeOptions = this.chargeData.shareChargeTimeTypeOptions;
        this.chargeCalculationTypeOptions = this.chargeData.shareChargeCalculationTypeOptions;
        this.addFeeFrequency = false;
        this.showGLAccount = false;
        this.showPenalty = false;
        break;
      }
      default: {
        this.chargeCalculationTypeOptions = this.chargeData.clientChargeCalculationTypeOptions;
        this.chargeTimeTypeOptions = this.chargeData.clientChargeTimeTypeOptions;
        this.showGLAccount = true;
        this.addFeeFrequency = false;
        this.chargeForm.addControl('incomeAccountId', this.formBuilder.control(this.chargeData.incomeOrLiabilityAccount.id, Validators.required));
        break;
      }
    }
    if (this.chargeData.taxGroup) {
      this.chargeForm.addControl('taxGroupId', this.formBuilder.control({ value: this.chargeData.taxGroup.id, disabled: true }));
    } else {
      this.chargeForm.addControl('taxGroupId', this.formBuilder.control({ value: '' }));
    }
  }

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
    charges.locale = this.settingsService.language.code;
    if (charges.taxGroupId.value === '') {
      delete charges.taxGroupId;
    }
    if (!charges.minCap) {
      delete charges.minCap;
    }
    if (!charges.maxCap) {
      delete charges.maxCap;
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
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }


  enableOrDisableCupoMaxSellField(itemName: String, selected: boolean) {
    this.chargeCalculationTypeOptions = [];
    let lookForWordsArray: any = [];
    let isFilterApplied = false;

    if(this.chargeForm.value.chargeCalculationTypeFilterFlat) {
      lookForWordsArray.push('flat');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterDisbursal) {
      lookForWordsArray.push('disbursedamount');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterAmount) {
      lookForWordsArray.push('installmentprincipal');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterInterest) {
      lookForWordsArray.push('installmentinterest');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterOutstandingAmount) {
      lookForWordsArray.push('outstandingprincipal');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterOutstandingInterest) {
      lookForWordsArray.push('outstandinginterest');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterInsurance) {
      lookForWordsArray.push('seguroobrigatorio');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterAval) {
      lookForWordsArray.push('aval');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterHonorarios) {
      lookForWordsArray.push('honorarios');
      isFilterApplied = true;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterTerm) {
      lookForWordsArray.push('percentofanothercharge');
      isFilterApplied = true;
      this.showAnotherChargeCombobox = true;
    } else {
      this.showAnotherChargeCombobox = false;
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      lookForWordsArray.push('segurovoluntarioasistencia');
      isFilterApplied = true;
    }

    if (this.chargeForm.value.chargeCalculationTypeFilterInsuranceType) {
      if (!this.chargeForm.value.chargeCalculationTypeFilterFlat || lookForWordsArray.length > 2) {
        this.showVoluntaryInsuranceError = true;
        this.voluntaryInsuranceErrorCode = 'error.msg.only.flat.type.allowed.for.voluntary.insurance';
        return;
      } else {
        this.showVoluntaryInsuranceError = false;
        this.voluntaryInsuranceErrorCode = '';
      }
    }

    for (let index = 0; index <= this.originalChargeCalculationTypeData.length-1; index++) {
      this.lookForKeyOnCode(lookForWordsArray, index);
    }

    // IOf nothing selected, restore the list
    if(lookForWordsArray.length == 0) {
      for (let index = 0; index <= this.originalChargeCalculationTypeData.length-1; index++) {
        this.chargeCalculationTypeOptions.push(this.originalChargeCalculationTypeData[index]);
      }
    }

    if(isFilterApplied) {
      this.chargeForm.get('chargeCalculationType').setValue(this.chargeCalculationTypeOptions[0].id);
    } else {
      this.chargeForm.get('chargeCalculationType').setValue(null);
    }
  }



  lookForKeyOnCode(lookForWordsArray: any = [], index: number) {
    let currCode = this.originalChargeCalculationTypeData[index].code;

    if(this.chargeCalculationTypeOptions.includes(this.originalChargeCalculationTypeData[index])) {
      return;
    }

    for (let i = 0; i <= lookForWordsArray.length-1; i++) {
      if(currCode.toString().indexOf("."+ lookForWordsArray[i]) == -1) {
        return;
      }
    }

    this.chargeCalculationTypeOptions.push(this.originalChargeCalculationTypeData[index]);
  }
}
