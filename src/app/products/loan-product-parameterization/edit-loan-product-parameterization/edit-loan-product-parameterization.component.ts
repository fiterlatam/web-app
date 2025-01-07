import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ProductParameterizationService} from '../product-parameterization.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';
import {Dates} from '../../../core/utils/dates';

@Component({
  selector: 'mifosx-edit-loan-product-parameterization',
  templateUrl: './edit-loan-product-parameterization.component.html',
  styleUrls: ['./edit-loan-product-parameterization.component.scss']
})
export class EditLoanProductParameterizationComponent implements OnInit {
  productParamForm: UntypedFormGroup;
  productParamData: any;

  constructor(private formBuilder: UntypedFormBuilder,
              private productParameterizationService: ProductParameterizationService,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService, private dateUtils: Dates) {
    this.route.data.subscribe((data: { loanProductParameterization: any }) => {
      this.productParamData = data.loanProductParameterization;
    });
  }

  ngOnInit(): void {
    this.editLoanProductParameterizationForm();
  }

  editLoanProductParameterizationForm() {
    this.productParamForm = this.formBuilder.group({
      billingPrefix: [this.productParamData.billingPrefix, [Validators.required, Validators.maxLength(6)]],
      productType: [this.productParamData.productType],
      billingResolutionNumber: [this.productParamData.billingResolutionNumber || 0, [Validators.required, Validators.maxLength(50)]],
      generationDate: [this.dateUtils.parseDate(this.productParamData.generationDate)],
      expirationDate: [this.dateUtils.parseDate(this.productParamData.expirationDate)],
      rangeStartNumber: [this.productParamData.rangeStartNumber || 0, [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern('^[0-9]{1,4}$'), // Ensures only digits, 1-4 characters
        Validators.max(9999) // Ensures numeric value doesn't exceed 9999
      ]],
      rangeEndNumber: [this.productParamData.rangeEndNumber || 0, [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern('^[0-9]{1,4}$'), // Ensures only digits, 1-4 characters
        Validators.max(9999) // Ensures numeric value doesn't exceed 9999
      ]],
      lastInvoiceNumber: [this.productParamData.lastInvoiceNumber],
      lastCreditNoteNumber: [this.productParamData.lastCreditNoteNumber],
      lastDebitNoteNumber: [this.productParamData.lastDebitNoteNumber],
      note: [this.productParamData.note],
      technicalKey: [this.productParamData.technicalKey, [Validators.required, Validators.maxLength(100)]]
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
    this.productParameterizationService.updateParameter(this.productParamData.id, data).subscribe((response: any) => {
      this.router.navigate(['../../'], {relativeTo: this.route});
    });
  }

}
