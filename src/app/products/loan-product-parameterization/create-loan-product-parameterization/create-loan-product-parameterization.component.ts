import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {InsuranceIncidentService} from '../../insurance-incident/insurance-incident.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';
import {ProductParameterizationService} from '../product-parameterization.service';
import {Dates} from '../../../core/utils/dates';

@Component({
  selector: 'mifosx-create-loan-product-parameterization',
  templateUrl: './create-loan-product-parameterization.component.html',
  styleUrls: ['./create-loan-product-parameterization.component.scss']
})
export class CreateLoanProductParameterizationComponent implements OnInit {
  productParamForm: UntypedFormGroup;
  productParamData: any;
  productTypes: string[] = [];
  loanProductsTemplate: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productParameterizationService: ProductParameterizationService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private dateUtils: Dates
  ) {
    this.route.data.subscribe((data: { loanProductParameterization: any }) => {
      this.productParamData = data.loanProductParameterization;
    });
    this.route.data.subscribe((data: { loanProductsTemplate: any }) => {
      this.loanProductsTemplate = data.loanProductsTemplate;
      this.productTypes = this.loanProductsTemplate?.productTypeOptions?.map((productType: {
        name: string
      }) => productType.name);
    });
  }

  ngOnInit(): void {
    this.createProductParamForm();
  }

  createProductParamForm() {
    this.productParamForm = this.formBuilder.group({
      billingPrefix: ['', [Validators.required, Validators.maxLength(6)]],
      productType: ['', Validators.required],
      billingResolutionNumber: [0, [Validators.required, Validators.maxLength(50)]],
      generationDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      rangeStartNumber: [0, [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern('^[0-9]{1,4}$'), // Ensures only digits, 1-4 characters
        Validators.max(9999) // Ensures numeric value doesn't exceed 9999
      ]],
      rangeEndNumber: [0, [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern('^[0-9]{1,4}$'), // Ensures only digits, 1-4 characters
        Validators.max(9999) // Ensures numeric value doesn't exceed 9999
      ]],
      lastInvoiceNumber: [0, Validators.required],
      lastCreditNoteNumber: [0, Validators.required],
      lastDebitNoteNumber: [0, Validators.required]
    });
  }

  onSave() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const productParamFormData = this.productParamForm.value;
    if (productParamFormData.generationDate instanceof Date) {
      productParamFormData.generationDate = this.dateUtils.formatDate(productParamFormData.generationDate, dateFormat);
    }
    if (productParamFormData.expirationDate instanceof Date) {
      productParamFormData.expirationDate = this.dateUtils.formatDate(productParamFormData.expirationDate, dateFormat);
    }
    const data = {
      ...productParamFormData,
      dateFormat,
      locale
    };
    this.productParameterizationService.saveParameters(data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }
}
