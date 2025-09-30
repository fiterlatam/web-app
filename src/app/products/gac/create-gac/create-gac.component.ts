import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dates } from 'app/core/utils/dates';
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-create-gac',
  templateUrl: './create-gac.component.html',
  styleUrls: ['./create-gac.component.scss']
})
export class CreateGacComponent implements OnInit {

  /** Gac form. */
  gacForm: UntypedFormGroup;
  gacTemplate: any;
  blockingReasonOptions: any[];

  constructor(private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService) {
      this.route.data.subscribe((data: { gacTemplate: any, blockingReasons: any[] }) => {
      this.gacTemplate = data.gacTemplate;
      this.blockingReasonOptions = data.gacTemplate.blockingReasons;
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
      'classification': ['', [Validators.required]],
      'minimumAgeDays': [0, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*?)$'), Validators.max(1000)]],
      'maximumAgeDays': ['', [Validators.required, Validators.pattern('^(0*[1-9][0-9]*?)$'), Validators.max(10000)]],
      'percentageValue' : [0, [Validators.required, Validators.pattern('^(0*[0-9][0-9]*?)$'), Validators.max(10000)]],
      'blockingReasonId': [''],
    });
  }

  submit(): void {
    const gacFormData = this.gacForm.value;
    const locale = this.settingsService.language.code;
    const data = {
      ...gacFormData,
      locale
    };
    this.productsService.createGac(data).subscribe((response: any) => {
      this.router.navigate(['../', response.resourceId], { relativeTo: this.route });
    });
  }

}
