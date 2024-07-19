import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';
import {logger} from 'codelyzer/util/logger';
import {CustomChargeTypeMapService} from '../customchargetypemap.service';

@Component({
  selector: 'mifosx-create-charge-map',
  templateUrl: './create-charge-map.component.html',
  styleUrls: ['./create-charge-map.component.scss']
})
export class CreateChargeMapComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  chargeMapForm: UntypedFormGroup;
  chargeMapTemplate: any;
  chargeOptions: any[];
  chargeTypeOptions: any[] = [];
  clientAllyOptions: any[] = [];
  pointOfSalesOptions: any[] = [];
  pointOfSales: any[] = [];
  template: File;

  constructor(private formBuilder: UntypedFormBuilder,
              private customChargeTypeMapService: CustomChargeTypeMapService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { customChargeTemplate: any }) => {
      this.chargeMapTemplate = data.customChargeTemplate;
      this.chargeOptions = this.chargeMapTemplate.customChargeOptions;
      this.clientAllyOptions = this.chargeMapTemplate.clientAllyOptions;
      this.pointOfSales  = this.chargeMapTemplate.pointOfSales || [];
    });
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = this.settingsService.maxAllowedDate;
    this.createChargeMapForm();
  }

  createChargeMapForm() {
    const locale = this.settingsService.language.code;
    this.chargeMapForm = this.formBuilder.group({
      'customChargeEntityId': ['', Validators.required],
      'customChargeTypeId': ['', Validators.required],
      'term': ['', Validators.required],
      'percentage': [this.decimalPipe.transform(0, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(100)]],
      'validFromDate': [this.minDate && new Date(this.minDate), [Validators.required]]
    });
  }

  reloadChargeTypeOptions(id: any) {
    this.customChargeTypeMapService.getCustomChargeType(id).subscribe(( apiResponseBody: any ) => {
      this.chargeTypeOptions = apiResponseBody;
    });
  }

  submit() {
    const chargeMapFormData = this.chargeMapForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const validFromDate: Date = this.chargeMapForm.value.validFromDate;
    if (chargeMapFormData.validFromDate instanceof Date) {
      chargeMapFormData.validFromDate = this.dateUtils.formatDate(validFromDate, dateFormat);
    }
    let selectedPointOfSales = [];
    const pointOfSales = chargeMapFormData.pointOfSales;
    if (pointOfSales && pointOfSales.length > 0) {
      selectedPointOfSales = pointOfSales
        .map((opt: any, i: number) => opt ? {id: this.pointOfSalesOptions[i].id} : null)
        .filter((opt: any) => opt !== null);
    }
    chargeMapFormData.pointOfSales = selectedPointOfSales;
    const data = {
      ...chargeMapFormData,
      dateFormat,
      locale
    };
    this.customChargeTypeMapService.createCustomChargeTypeMap(data).subscribe(() => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Custom charge map created successfully'));
    });
  }
}
