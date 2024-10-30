/** Angular Imports */
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-loan-product-details-step',
  templateUrl: './loan-product-details-step.component.html',
  styleUrls: ['./loan-product-details-step.component.scss']
})
export class LoanProductDetailsStepComponent implements OnInit {

  @Input() loanProductsTemplate: any;

  loanProductDetailsForm: UntypedFormGroup;

  fundData: any;
  productTypeData: any;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10));

  /**
   * @param {UntypedFormBuilder} formBuilder Form Builder.
   * @param {Dates} dateUtils Date Utils.
   * @param {SettingsService} settingsService Settings Service.
   */

  constructor(private formBuilder: UntypedFormBuilder,
              private dateUtils: Dates,
              private settingsService: SettingsService) {
    this.createLoanProductDetailsForm();
  }

  ngOnInit() {
    this.fundData = this.loanProductsTemplate.fundOptions;
    this.productTypeData = this.loanProductsTemplate.productTypeOptions;
    this.loanProductDetailsForm.patchValue({
      'name': this.loanProductsTemplate.name,
      'shortName': this.loanProductsTemplate.shortName,
      'description': this.loanProductsTemplate.description,
      'fundId': this.loanProductsTemplate.fundId,
      'startDate': this.loanProductsTemplate.startDate && new Date(this.loanProductsTemplate.startDate),
      'closeDate': this.loanProductsTemplate.closeDate && new Date(this.loanProductsTemplate.closeDate),
      'includeInBorrowerCycle': this.loanProductsTemplate.includeInBorrowerCycle,
      'advance': this.loanProductsTemplate.advance,
      'productType': this.loanProductsTemplate.productType ? this.loanProductsTemplate.productType.id : '',
      'useOtherLoansCupo': this.loanProductsTemplate.useOtherLoansCupo,
    });
    this.loanProductDetailsForm.get('productType')?.valueChanges.subscribe(productTypeValue => {
        if (this.isProductTypeSuVehicle(productTypeValue)) {
          this.loanProductDetailsForm.get('vehicleCupo')?.setValidators([Validators.required]);
        } else {
          this.loanProductDetailsForm.get('vehicleCupo')?.clearValidators();
        }
        this.loanProductDetailsForm.get('vehicleCupo')?.updateValueAndValidity();
    });
  }

  createLoanProductDetailsForm() {
    this.loanProductDetailsForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'shortName': ['', Validators.required],
      'description': [''],
      'fundId': [''],
      'startDate': [''],
      'closeDate': [''],
      'includeInBorrowerCycle': [false],
      'advance': [false],
      'productType': ['', Validators.required],
      'useOtherLoansCupo': [false],
    });
  }

  get loanProductDetails() {
    const loanProductDetailsFormData = this.loanProductDetailsForm.value;
    const prevStartDate: Date = this.loanProductDetailsForm.value.startDate;
    const prevCloseDate: Date = this.loanProductDetailsForm.value.closeDate;
    const dateFormat = this.settingsService.dateFormat;
    if (loanProductDetailsFormData.startDate instanceof Date) {
      loanProductDetailsFormData.startDate = this.dateUtils.formatDate(prevStartDate, dateFormat) || '';
    }
    if (loanProductDetailsFormData.closeDate instanceof Date) {
      loanProductDetailsFormData.closeDate = this.dateUtils.formatDate(prevCloseDate, dateFormat) || '';
    }
    return loanProductDetailsFormData;
  }

  isProductTypeSuVehicle(productTypeValue?: string): boolean {
    const productTypeId = productTypeValue ? productTypeValue : this.loanProductDetailsForm.value.productType;
    for (let i = 0; i < this.productTypeData.length; i++) {
      if (this.productTypeData[i].name === 'SU+ Vehiculos'
        && this.productTypeData[i].id === productTypeId) {
        return true;
      }
    }
    return false;
  }
}
