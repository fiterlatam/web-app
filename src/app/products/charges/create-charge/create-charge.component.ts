/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Services */
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { ArrayType } from '@angular/compiler';

/**
 * Create charge component.
 */
@Component({
  selector: 'mifosx-create-charge',
  templateUrl: './create-charge.component.html',
  styleUrls: ['./create-charge.component.scss']
})
export class CreateChargeComponent implements OnInit {

  /** Charge form. */
  chargeForm: UntypedFormGroup;
  /** Charges template data. */
  chargesTemplateData: any;
  /** Charge time type data. */
  chargeTimeTypeData: any;
  /** Charge calculation type data. */
  chargeCalculationTypeData: any = [];

  /** Charge calculation type data. */
  originalChargeCalculationTypeData: any = []; 

  chargeCalculationTypeFilter: any;
  chargeCalculationTypeFilterAmount: boolean = false;
  chargeCalculationTypeFilterInterest: boolean = false;
  chargeCalculationTypeFilterOutstandingAmount: boolean = false;
  chargeCalculationTypeFilterInsurance: boolean = false;
  chargeCalculationTypeFilterAval: boolean = false;
  chargeCalculationTypeFilterHonorarios: boolean = false;
  chargeCalculationTypeFilterTerm: boolean = false;

  

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

  /**
   * Retrieves the charges template data and income and liability account data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ProductsService} productsService Products Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {Dates} dateUtils Date Utils to format date.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { chargesTemplate: any }) => {
      this.chargesTemplateData = data.chargesTemplate;
      if (data.chargesTemplate.incomeOrLiabilityAccountOptions.liabilityAccountOptions) {
        this.incomeAndLiabilityAccountData = data.chargesTemplate.incomeOrLiabilityAccountOptions.incomeAccountOptions
          .concat(data.chargesTemplate.incomeOrLiabilityAccountOptions.liabilityAccountOptions);
      } else {
        this.incomeAndLiabilityAccountData = data.chargesTemplate.incomeOrLiabilityAccountOptions.incomeAccountOptions;
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
      'amount': ['', [Validators.required, Validators.pattern('^\\s*(?=.*[1-9])\\d*(?:\\.\\d+)?\\s*$')]],
      'active': [false],
      'penalty': [false],
      'taxGroupId': [''],
      'minCap': [''],
      'maxCap': [''],
      'graceOnChargePeriodAmount': ['0'],
      'chargeCalculationTypeFilterAmount': [false],
      'chargeCalculationTypeFilterInterest': [false],
      'chargeCalculationTypeFilterOutstandingAmount': [false],
      'chargeCalculationTypeFilterInsurance': [false],
      'chargeCalculationTypeFilterAval': [false],
      'chargeCalculationTypeFilterHonorarios': [false],
      'chargeCalculationTypeFilterTerm': [false],
    });
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

      this.chargeForm.removeControl('chargeCalculationTypeFilterAmount');
      this.chargeForm.removeControl('chargeCalculationTypeFilterInterest');
      this.chargeForm.removeControl('chargeCalculationTypeFilterOutstandingAmount');
      this.chargeForm.removeControl('chargeCalculationTypeFilterInsurance');
      this.chargeForm.removeControl('chargeCalculationTypeFilterAval');
      this.chargeForm.removeControl('chargeCalculationTypeFilterHonorarios');
      this.chargeForm.removeControl('chargeCalculationTypeFilterTerm');

      switch (chargeAppliesTo) {
        case 1: // Loan
          this.chargeForm.addControl('chargePaymentMode', new UntypedFormControl('', Validators.required));
          this.chargeForm.removeControl('incomeAccountId');

          this.chargeForm.addControl('graceOnChargePeriodAmount', new UntypedFormControl('0', Validators.required));
          this.chargeForm.addControl('graceOnChargePeriodEnum', new UntypedFormControl('days', Validators.required));
          this.chargeForm.addControl('chargeCalculationTypeFilterAmount', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterInterest', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterOutstandingAmount', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterInsurance', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterAval', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterHonorarios', new UntypedFormControl(false));
          this.chargeForm.addControl('chargeCalculationTypeFilterTerm', new UntypedFormControl(false));

          break;
        case 2: // Savings
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.removeControl('incomeAccountId');
          break;
        case 3: // Client
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.addControl('incomeAccountId', new UntypedFormControl(''));
          break;
        case 4: // Shares
          this.chargeForm.removeControl('chargePaymentMode');
          this.chargeForm.removeControl('incomeAccountId');
          this.chargeForm.get('penalty').setValue(false);
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
    this.chargeForm.get('currencyCode').valueChanges.subscribe((currencyCode) => {
      this.currencyDecimalPlaces = this.chargesTemplateData.currencyOptions.find((currency: any) => currency.code === currencyCode).decimalPlaces;
      if (this.currencyDecimalPlaces === 0) {
        this.chargeForm.get('amount').setValidators([Validators.required, Validators.pattern('^[1-9]\\d*$')]);
      } else {
        this.chargeForm.get('amount').setValidators([Validators.required, Validators.pattern(`^\\s*(?=.*[1-9])\\d*(\\.\\d{1,${this.currencyDecimalPlaces}})?\\s*$`)]);
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

    delete data.chargeCalculationTypeFilterAmount;
    delete data.chargeCalculationTypeFilterInterest;
    delete data.chargeCalculationTypeFilterOutstandingAmount;
    delete data.chargeCalculationTypeFilterInsurance;
    delete data.chargeCalculationTypeFilterAval;
    delete data.chargeCalculationTypeFilterHonorarios;
    delete data.chargeCalculationTypeFilterTerm;

    this.productsService.createCharge(data).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  enableOrDisableCupoMaxSellField(itemName: String, selected: boolean) {
    this.chargeCalculationTypeData = [];
    let lookForWordsArray: any = [];

    if(this.chargeForm.value.chargeCalculationTypeFilterAmount) {
      lookForWordsArray.push('amount');      
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterInterest) {
      lookForWordsArray.push('interest');
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterOutstandingAmount) {
      lookForWordsArray.push('outstanding');
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterInsurance) {
      lookForWordsArray.push('insurance');
    }

    if(this.chargeForm.value.chargeCalculationTypeFilterAval) {
      lookForWordsArray.push('aval');
    }
    
    if(this.chargeForm.value.chargeCalculationTypeFilterHonorarios) {
      lookForWordsArray.push('honorarios');
    }    

    if(this.chargeForm.value.chargeCalculationTypeFilterHonorarios) {
      lookForWordsArray.push('term');
    }    

    for (let index = 0; index <= this.originalChargeCalculationTypeData.length-1; index++) {
      this.lookForKeyOnCode(lookForWordsArray, index);
    } 

    // IOf nothing selected, restore the list
    if(lookForWordsArray.length == 0) {
      for (let index = 0; index <= this.originalChargeCalculationTypeData.length-1; index++) {
        this.chargeCalculationTypeData.push(this.originalChargeCalculationTypeData[index]);
      } 
    }
  }  


  lookForKeyOnCode(lookForWordsArray: any = [], index: number) {
    let currCode = this.originalChargeCalculationTypeData[index].code;

    for (let i = 0; i <= lookForWordsArray.length-1; i++) {
      if(currCode.toString().indexOf("."+ lookForWordsArray[i]) == -1) {
        return;
      }
    }

    this.chargeCalculationTypeData.push(this.originalChargeCalculationTypeData[index]);
  }
}
