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
  templateUrl: './vip-commerce-map.component.html',
  styleUrls: ['./vip-commerce-map.component.scss']
})
export class VipCommerceMapComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  vipCommerceMapForm: UntypedFormGroup;
  vipCommerceMapTemplate: any;
  customChargeTypeOptions: any[] = [];
  clientAllyOptions: any[] = [];
  pointOfSalesOptions: any[] = [];
  pointOfSales: any[] = [];
  template: File;
  clients: any[] = [];
  constructor(private formBuilder: UntypedFormBuilder,
              private customChargeTypeMapService: CustomChargeTypeMapService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { vipCommerceMapTemplate: any }) => {
      this.vipCommerceMapTemplate = data.vipCommerceMapTemplate;
      this.customChargeTypeOptions = this.vipCommerceMapTemplate.customChargeTypeOptions;
      this.clientAllyOptions = this.vipCommerceMapTemplate.clientAllyOptions;
      this.clients = this.vipCommerceMapTemplate.clients;
      this.pointOfSales  = this.vipCommerceMapTemplate.pointOfSales;
    });
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = this.settingsService.maxAllowedDate;
    this.createChargeMapForm();
    this.pointOfSaleControl();
  }

  createChargeMapForm() {
    this.vipCommerceMapForm = this.formBuilder.group({
      'customChargeTypeId': ['', Validators.required]
    });
  }

  pointOfSaleControl() {
    const pointOfSaleControl = this.formBuilder.array([]);
    let pointOfSaleOptions: { id: number; }[] = [];
    for (const clientAllyOption of this.clientAllyOptions) {
      pointOfSaleOptions = [...pointOfSaleOptions, ...clientAllyOption.pointOfSales];
      this.pointOfSalesOptions = pointOfSaleOptions;
    }
    this.vipCommerceMapForm.addControl('pointOfSales', pointOfSaleControl);
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
    const chargeMapFormData = this.vipCommerceMapForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const validFromDate: Date = this.vipCommerceMapForm.value.validFromDate;
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
    chargeMapFormData.command = 'commerceMapping';
    const data = {
      ...chargeMapFormData,
      dateFormat,
      locale
    };

    if (this.vipCommerceMapForm.controls.customChargeTypeId.value === 1) {
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
