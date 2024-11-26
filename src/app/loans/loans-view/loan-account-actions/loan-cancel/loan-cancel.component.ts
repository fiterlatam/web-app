import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoansService } from 'app/loans/loans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-cancel-loan',
  templateUrl: './loan-cancel.component.html',
  styleUrls: ['./loan-cancel.component.scss']
})
export class LoanCancelComponent implements OnInit {
  @Input() dataObject: any;

  loanId: any;
  loanCancelForm: UntypedFormGroup;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  loanCancelData: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private loanService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private settingsService: SettingsService) {
      this.loanId = this.route.snapshot.params['loanId'];
    }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createLoanCancelForm();
    this.onChanges();
  }

  createLoanCancelForm() {
    this.loanCancelForm = this.formBuilder.group({
      'transactionDate': [this.dataObject.date && new Date(this.dataObject.date), Validators.required],
      'outstandingPrincipalPortion': [{value: this.dataObject.principalPortion || 0, disabled: true}],
      'outstandingInterestPortion': [{value: this.dataObject.interestPortion || 0, disabled: true}],
      'outstandingFeeChargesPortion': [{value: this.dataObject.feeChargesPortion || 0, disabled: true}],
      'outstandingPenaltyChargesPortion': [{value: this.dataObject.penaltyChargesPortion || 0, disabled: true}],
      'transactionAmount': [{value: this.dataObject.amount, disabled: true}],
      'note': ['', Validators.required]
    });
  }

  onChanges(): void {
    this.loanCancelForm.get('transactionDate').valueChanges.subscribe(val => {
      this.retrieveLoanForeclosureTemplate(val);
    });

  }

  retrieveLoanForeclosureTemplate(val: any) {
    const dateFormat = this.settingsService.dateFormat;
    const transactionDateFormatted = this.dateUtils.formatDate(val, dateFormat);
    const data = {
      command: 'anulado',
      dateFormat: this.settingsService.dateFormat,
      locale: this.settingsService.language.code,
      transactionDate: transactionDateFormatted
    };
    this.loanService.getForeclosureData(this.loanId, data)
    .subscribe((response: any) => {
      this.loanCancelData = response;
      this.loanCancelForm.patchValue({
        outstandingPrincipalPortion: this.loanCancelData.principalPortion,
        outstandingInterestPortion: this.loanCancelData.interestPortion,
        outstandingFeeChargesPortion: this.loanCancelData.feeChargesPortion,
        outstandingPenaltyChargesPortion: this.loanCancelData.penaltyChargesPortion,
      });
    });
  }

  submit() {
    const foreclosureFormData = this.loanCancelForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevTransactionDate = this.loanCancelForm.value.transactionDate;
    if (foreclosureFormData.transactionDate instanceof Date) {
      foreclosureFormData.transactionDate = this.dateUtils.formatDate(prevTransactionDate, dateFormat);
    }
    const data = {
      ...foreclosureFormData,
      dateFormat,
      locale
    };

    this.loanService.cancelLoan(this.loanId, data)
      .subscribe(() => {
        this.router.navigate([`../../general`], {relativeTo: this.route}).then(r => logger.info('Loan Cancel Successful'));
      });
    }

}
