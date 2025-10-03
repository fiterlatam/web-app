import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dates } from 'app/core/utils/dates';
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-edit-gac',
  templateUrl: './edit-gac.component.html',
  styleUrls: ['./edit-gac.component.scss']
})
export class EditGacComponent implements OnInit {

  /** Gac Data. */
  gacData: any;
  /** Gac form. */
  gacForm: UntypedFormGroup;
  blockingReasonOptions: any[];

  constructor(private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { gac: any }) => {
      this.gacData = data.gac;
      this.blockingReasonOptions = data.gac.blockingReasons;
    });
  }

  ngOnInit(): void {
    this.setInputForm();
  }

  /**
   * Create Input form.
   */
  setInputForm(): void {
    this.gacForm = this.formBuilder.group({
      'classification': [this.gacData.classification, [Validators.required]],
      'minimumAgeDays': [this.gacData.minimumAgeDays, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*?)$'), Validators.max(1000)]],
      'maximumAgeDays': [this.gacData.maximumAgeDays, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*?)$'), Validators.max(10000)]],
      'percentageValue' : [this.gacData.percentageValue, [Validators.required, Validators.pattern('^(0*[0-9][0-9]*?)$'), Validators.max(10000)]],
      'blockingReasonId': [this.gacData.blockingReasonId],
    });
  }

  submit(): void {
    const gacFormData = this.gacForm.value;
    const locale = this.settingsService.language.code;
    const data = {
      ...gacFormData,
      locale
    };
    this.productsService.updateGac(this.gacData.id, data).subscribe((response: any) => {
      this.router.navigate(['../../', response.resourceId], { relativeTo: this.route });
    });
  }

  clearBlockingReason(): void {
  this.gacForm.patchValue({
    blockingReasonId: null
  });
}

}
