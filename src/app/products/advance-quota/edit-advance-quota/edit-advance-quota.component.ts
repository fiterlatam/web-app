import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import {DecimalPipe} from '@angular/common';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-edit-advance-quota',
  templateUrl: './edit-advance-quota.component.html',
  styleUrls: ['./edit-advance-quota.component.scss']
})
export class EditAdvanceQuotaComponent implements OnInit {
  advanceQuotaForm: UntypedFormGroup;
  advanceQuotaData: any;
  constructor(private formBuilder: UntypedFormBuilder,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private router: Router,
              private decimalPipe: DecimalPipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { advanceQuotaConfiguration: any }) => {
      this.advanceQuotaData = data.advanceQuotaConfiguration;
    });
  }

  ngOnInit() {
    this.editAdvanceQuotaForm();
  }

  editAdvanceQuotaForm() {
    const locale = this.settingsService.language.code;
    this.advanceQuotaForm = this.formBuilder.group({
      'percentageValue': [this.decimalPipe.transform(this.advanceQuotaData.percentageValue, '1.2-2', locale), [Validators.required, Validators.pattern('^[0-9,\\.]+$'), Validators.min(0.001), Validators.maxLength(6), Validators.max(100)]],
      'enabled': [this.advanceQuotaData.enabled, Validators.required]
    });
  }

  submit() {
    const advanceQuotaFormData = this.advanceQuotaForm.value;
    const locale = this.settingsService.language.code;
    const data = {
      ...advanceQuotaFormData,
      locale
    };
    this.productsService.updateAdvanceQuotaConfiguration(data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Successfully redirected to Advance Quota.'));
    });
  }

}
