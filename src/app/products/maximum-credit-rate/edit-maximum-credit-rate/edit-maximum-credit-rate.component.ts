/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Services */
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';

/**
 * Edit tax component.
 */
@Component({
  selector: 'mifosx-edit-tax-component',
  templateUrl: './edit-maximum-credit-rate.component.html',
  styleUrls: ['./edit-maximum-credit-rate.component.scss']
})
export class EditMaximumCreditRateComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum start date allowed. */
  maxDate = new Date();
  /** Tax Component form. */
  maximumCreditRateForm: UntypedFormGroup;
  /** Tax Component data. */
  maximumCreditRateData: any;

  /**
   * Retrieves the Maximum Credit Rate data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ProductsService} productsService Products Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {Dates} dateUtils Date Utils to format date.
   * @param decimalPipe
   * @param {SettingsService} settingsService Settings Service.
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
      this.route.data.subscribe((data: { taxComponent: any }) => {
      this.maximumCreditRateData = data.taxComponent;
    });

    this.route.data.subscribe((data: { maximumCreditRate: any }) => {
      this.maximumCreditRateData = data.maximumCreditRate;
    });
  }
  /**
   * Creates the Edit Maximum Credit Rate form.
   */
  ngOnInit() {
    this.minDate = this.settingsService.minAllowedDate;
    this.maxDate = this.settingsService.maxAllowedDate;
    this.editMaximumCreditRate();
  }

  /**
   * Edit Maximum Credit Rate form
   */
  editMaximumCreditRate() {
    const locale = this.settingsService.language.code;
    this.maximumCreditRateForm = this.formBuilder.group({
      'eaRate': [this.decimalPipe.transform(this.maximumCreditRateData.eaRate, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0.01), Validators.maxLength(5), Validators.max(100)]],
      'annualNominalRate': [{ value: this.decimalPipe.transform(this.maximumCreditRateData.annualNominalRate, '1.2-2', locale), disabled: true}],
      'monthlyNominalRate': [{ value: this.decimalPipe.transform(this.maximumCreditRateData.monthlyNominalRate, '1.2-2', locale), disabled: true}],
      'dailyNominalRate': [{ value: this.decimalPipe.transform(this.maximumCreditRateData.dailyNominalRate, '1.2-2', locale), disabled: true }],
      'appliedOnDate': [{ value: this.maximumCreditRateData.appliedOnDate && new Date(this.maximumCreditRateData.appliedOnDate), disabled: false}]
    });
  }

  onControlChange() {
    let eaRate = this.maximumCreditRateForm.get('eaRate').value;
    eaRate = eaRate.replace(/,/g, '.');
    if (isNaN(eaRate) || eaRate === null) {
      return;
    }
    const locale = this.settingsService.language.code;
    let annualNominalRate = this.calculateNominalInterestRate(eaRate, 1).toString();
    annualNominalRate = this.decimalPipe.transform(annualNominalRate, '1.2-2', locale);
    let monthlyNominalRate =  this.calculateNominalInterestRate(eaRate, 12).toString();
    monthlyNominalRate = this.decimalPipe.transform(monthlyNominalRate, '1.3-3', locale);
    let dailyNominalRate = this.calculateNominalInterestRate(eaRate, 365).toString();
    dailyNominalRate = this.decimalPipe.transform(dailyNominalRate, '1.3-3', locale);
    this.maximumCreditRateForm.get('annualNominalRate').setValue(annualNominalRate);
    this.maximumCreditRateForm.get('monthlyNominalRate').setValue(monthlyNominalRate);
    this.maximumCreditRateForm.get('dailyNominalRate').setValue(dailyNominalRate);
  }

  calculateNominalInterestRate(effectiveRate: number, n: number) {
    return (Math.pow(1 + effectiveRate / 100, 1 / n) - 1) * 100;
  }

  /**
   * Submits the Edit Maximum Credit Rate form and Edits Maximum Credit Rate,
   * if successfully redirects to Maximum Credit Rate.
   */
  submit() {
    const maximumCreditRateFormData = this.maximumCreditRateForm.value;
    maximumCreditRateFormData['annualNominalRate'] = this.maximumCreditRateForm.get('annualNominalRate').value;
    maximumCreditRateFormData['monthlyNominalRate'] = this.maximumCreditRateForm.get('monthlyNominalRate').value;
    maximumCreditRateFormData['dailyNominalRate'] = this.maximumCreditRateForm.get('dailyNominalRate').value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const appliedOnDate: Date = this.maximumCreditRateForm.value.appliedOnDate;
    if (maximumCreditRateFormData.appliedOnDate instanceof Date) {
      maximumCreditRateFormData.appliedOnDate = this.dateUtils.formatDate(appliedOnDate, dateFormat);
    }
    const data = {
      ...maximumCreditRateFormData,
      dateFormat,
      locale
    };
    this.productsService.updateMaximumCreditRate(data).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
