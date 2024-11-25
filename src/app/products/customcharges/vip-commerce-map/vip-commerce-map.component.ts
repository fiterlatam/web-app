import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
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
  pointOfSales: any[] = [];
  template: File;
  clients: any[] = [];
  constructor(private formBuilder: UntypedFormBuilder,
              private customChargeTypeMapService: CustomChargeTypeMapService,
              private route: ActivatedRoute,
              private router: Router,
              private dateUtils: Dates,
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
  }

  createChargeMapForm() {
    this.vipCommerceMapForm = this.formBuilder.group({
      'customChargeTypeId': ['', Validators.required]
    });
  }
  onFileSelect($event: any) {
    $event.preventDefault();
    if ($event.target.files.length > 0) {
      this.template = $event.target.files[0];
    }
  }

  downloadTemplate() {
    const date = new Date();
    const name = `import_template_${this.dateUtils.getDateYYYYMMDDHH(date)}.xlsx`;
    const customChargeTypeId = this.vipCommerceMapForm.controls.customChargeTypeId.value;
    this.customChargeTypeMapService.getImportTemplate(customChargeTypeId).subscribe( (res: any) => {
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
    const customChargeTypeId = this.vipCommerceMapForm.controls.customChargeTypeId.value;
    const data = {
      ...chargeMapFormData,
      dateFormat,
      locale
    };

    this.customChargeTypeMapService.createImportDocument(this.template, customChargeTypeId).subscribe(() => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(() => logger.info('Custom charge map created successfully'));
    });
  }
}
