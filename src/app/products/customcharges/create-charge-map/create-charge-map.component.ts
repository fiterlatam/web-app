import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {DecimalPipe} from '@angular/common';
import {logger} from 'codelyzer/util/logger';
import {CustomChargeTypeMapService} from '../customchargetypemap.service';
import {OrganizationService} from '../../../organization/organization.service';

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
    this.pointOfSaleControl();
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

  isChargeOfType(id: any, name: any) {
    return this.chargeTypeOptions.some(obj => obj.id === id && obj.name === name);
  }

  pointOfSaleControl() {
    const pointOfSaleControl = this.formBuilder.array([]);
    let pointOfSaleOptions: { id: number; }[] = [];
    for (const clientAllyOption of this.clientAllyOptions) {
      pointOfSaleOptions = [...pointOfSaleOptions, ...clientAllyOption.pointOfSales];
      this.pointOfSalesOptions = pointOfSaleOptions;
    }
    this.chargeMapForm.addControl('pointOfSales', pointOfSaleControl);
    if (this.pointOfSalesOptions && this.pointOfSalesOptions.length > 0) {
        this.pointOfSalesOptions.forEach((opt) => {
        const pointOfSaleId = opt.id;
        const formState = this.pointOfSales.some((x: { id: number }) => x.id === pointOfSaleId);
        pointOfSaleControl.push(this.formBuilder.control(formState));
      });
    }
  }

  displayPointOfSales(id: any) {
    for (const clientAllyOption of this.clientAllyOptions) {
      if (clientAllyOption.id === id) {
        clientAllyOption.isVisible = !clientAllyOption.isVisible;
      }
    }
  }

  findPointOfSaleIndex(id: any) {
    return this.pointOfSalesOptions.findIndex((pointOfSale) => pointOfSale.id === id);
  }

  onFileSelect($event: any) {
    $event.preventDefault();
    if ($event.target.files.length > 0) {
      this.template = $event.target.files[0];
    }
  }

  downloadTemplate() {
    const date = new Date();
    const name = `lista_clientes_vip_${this.dateUtils.getDateYYYYMMDDHH(date)}.xlsx`;
    this.customChargeTypeMapService.getImportTemplate().subscribe( (res: any) => {
      const contentType = res.headers.get('Content-Type');
      const blob = new Blob([res.body], { type: contentType });
      const fileOfBlob = new File([blob], name, { type: contentType });
      window.open(window.URL.createObjectURL(fileOfBlob));
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

    if (this.isChargeOfType(chargeMapFormData.customChargeTypeId, 'VIP')) {
      this.customChargeTypeMapService.createImportDocument(this.template, data).subscribe(() => {
        this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Custom charge map created successfully'));
      });
    } else {
      this.customChargeTypeMapService.createCustomChargeTypeMap(data).subscribe(() => {
        this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Custom charge map created successfully'));
      });
    }
  }
}
