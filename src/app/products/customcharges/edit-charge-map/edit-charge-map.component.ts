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
  templateUrl: './edit-charge-map.component.html',
  styleUrls: ['./edit-charge-map.component.scss']
})
export class EditChargeMapComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  editChargeMapForm: UntypedFormGroup;
  chargeMapTemplate: any;
  chargeOptions: any[];
  chargeTypeOptions: any[] = [];
  chargeMapData: any;
  clientAllyOptions: any[] = [];
  pointOfSales: any[] = [];
  pointOfSalesOptions: any[] = [];
  template: File;

  constructor(private formBuilder: UntypedFormBuilder,
              private customChargeTypeMapService: CustomChargeTypeMapService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { customChargeTemplate: any, chargeMapData: any }) => {
      this.chargeMapTemplate = data.customChargeTemplate;
      this.chargeOptions = this.chargeMapTemplate.customChargeOptions;
      this.chargeMapData = data.chargeMapData;
      this.loadChargeTypeOptions(this.chargeMapData.charge.id);
      this.clientAllyOptions = this.chargeMapTemplate.clientAllyOptions;
      this.pointOfSales  = this.chargeMapData.pointOfSales || [];
    });
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = this.settingsService.maxAllowedDate;
    this.loadChargeTypeOptions(this.chargeMapData.charge.id);
    this.createEditChargeMapForm();
    this.loadChargeTypeOptions(this.chargeMapData.charge.id);
  }

  createEditChargeMapForm() {
    const locale = this.settingsService.language.code;
    this.editChargeMapForm = this.formBuilder.group({
      'customChargeEntityId': [{ value: this.chargeMapData.charge.id, disabled: true }],
      'customChargeTypeId': [{ value: this.chargeMapData['chargeType'].id, disabled: true }],
      'term': [this.chargeMapData.term, Validators.required],
      'percentage': [this.decimalPipe.transform(this.chargeMapData.percentage, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(100)]],
      'validFromDate': [this.chargeMapData.validFromDate && new Date(this.chargeMapData.validFromDate), [Validators.required]]
    });
  }

  loadChargeTypeOptions(id: any) {
    this.customChargeTypeMapService.getCustomChargeType(id).subscribe(( apiResponseBody: any ) => {
      this.chargeTypeOptions = apiResponseBody;
    });
  }

  submit() {
    const chargeMapFormData = this.editChargeMapForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const validFromDate: Date = this.editChargeMapForm.value.validFromDate;
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
      this.customChargeTypeMapService.editCustomChargeTypeMap(data, this.chargeMapData.id).subscribe(() => {
        this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Custom charge map updated successfully'));
    });
  }

}
