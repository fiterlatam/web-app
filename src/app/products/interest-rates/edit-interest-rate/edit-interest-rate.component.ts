import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';
import { logger } from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-edit-interest-rate',
  templateUrl: './edit-interest-rate.component.html',
  styleUrls: ['./edit-interest-rate.component.scss']
})
export class EditInterestRateComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  interestRateForm: UntypedFormGroup;
  interestRateData: any;
  interestRateTypeOptions: any[];
  constructor(private formBuilder: UntypedFormBuilder,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { interestRate: any }) => {
      this.interestRateData = data.interestRate;
      this.interestRateTypeOptions = data.interestRate.interestRateTypeOptions;
    });
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = this.settingsService.maxAllowedDate;
    this.editInterestRate();
  }

  editInterestRate() {
    const locale = this.settingsService.language.code;
    this.interestRateForm = this.formBuilder.group({
      'currentRate': [this.decimalPipe.transform(this.interestRateData.currentRate, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0.01), Validators.maxLength(5), Validators.max(100)]],
      'appliedOnDate': [this.interestRateData.appliedOnDate && new Date(this.interestRateData.appliedOnDate), [Validators.required]],
      'active': [this.interestRateData.active, [Validators.required]],
      'interestRateTypeId': [this.interestRateData['interestRateType'] ? this.interestRateData['interestRateType'].id : '', Validators.required],
      'name': [this.interestRateData.name, [Validators.required]]
    });
  }

  submit() {
    const interestRateData = this.interestRateForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const appliedOnDate: Date = this.interestRateForm.value.appliedOnDate;
    if (interestRateData.appliedOnDate instanceof Date) {
      interestRateData.appliedOnDate = this.dateUtils.formatDate(appliedOnDate, dateFormat);
    }
    const data = {
      ...interestRateData,
      dateFormat,
      locale
    };
    this.productsService.updateInterestRate(this.interestRateData.id, data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Interest rate updated successfully'));
    });
  }

}
