import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'mifosx-create-interest-rate',
  templateUrl: './create-interest-rate.component.html',
  styleUrls: ['./create-interest-rate.component.scss']
})
export class CreateInterestRateComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  interestRateForm: UntypedFormGroup;
  interestRateTemplate: any;
  interestRateTypeOptions: any[];
  constructor(private formBuilder: UntypedFormBuilder,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { interestRateTemplate: any, interestRateTypeOptions: any[] }) => {
      this.interestRateTemplate = data.interestRateTemplate;
      this.interestRateTypeOptions = data.interestRateTemplate.interestRateTypeOptions;
    });
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = this.settingsService.maxAllowedDate;
    this.createInterestRate();
  }

  createInterestRate() {
    const locale = this.settingsService.language.code;
    let currentRate = 0;
    if (this.interestRateTemplate['maximumCreditRateConfiguration'] && this.interestRateTemplate['maximumCreditRateConfiguration'].annualNominalRate) {
      currentRate = this.interestRateTemplate['maximumCreditRateConfiguration'].annualNominalRate;
    }
    this.interestRateForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'minRate': [this.decimalPipe.transform(0, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(100)]],
      'currentRate': [this.decimalPipe.transform(currentRate, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(100)]],
      'maxRate': [this.decimalPipe.transform(0, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(100)]],
      'appliedOnDate': [this.minDate && new Date(this.minDate), [Validators.required]],
      'interestRateTypeId': ['', Validators.required],
      'active': [true, [Validators.required]]
    });
  }

  submit() {
    const maximumCreditRateFormData = this.interestRateForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const appliedOnDate: Date = this.interestRateForm.value.appliedOnDate;
    if (maximumCreditRateFormData.appliedOnDate instanceof Date) {
      maximumCreditRateFormData.appliedOnDate = this.dateUtils.formatDate(appliedOnDate, dateFormat);
    }
    const data = {
      ...maximumCreditRateFormData,
      dateFormat,
      locale
    };
    this.productsService.createInterestRate(data).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
