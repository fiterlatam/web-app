import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'app/core/alert/alert.service';
import { Dates } from 'app/core/utils/dates';
import { LoanBlockAccountService } from 'app/loans/services/loan-block-account.service';
import { SettingsService } from 'app/settings/settings.service';
import { SystemService } from 'app/system/system.service';

@Component({
  selector: 'mifosx-loans-block-account-edit',
  templateUrl: './loans-block-account-edit.component.html',
  styleUrls: ['./loans-block-account-edit.component.scss']
})
export class LoansBlockAccountEditComponent implements OnInit {

  /** Loan Id */
  loanId: any;
  /** Reason Options */
  blockData: any;
  /** Reason Options */
  reasonOptions: any;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Block Loan form. */
  blockLoanForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private blockService: LoanBlockAccountService,
    private systemService: SystemService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private router: Router) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.getBlockData();
    this.getReasons();
    this.setBlockLoanForm();
  }

  setBlockLoanForm() {
    this.blockLoanForm = this.formBuilder.group({
      'applicationDate': [this.settingsService.businessDate, Validators.required],
      'loanId': [this.loanId],
      'blockingReasonId': ['', Validators.required],
      'accelerate': [false],
      'freezeCurrentInterest': [false],
      'freezeInterestArrears': [false],
      'freezeLifeInsurance': [false],
      'freezeMypime': [false],
      'active': [true]

    });
  }

  getReasons() {
    this.systemService.retrieveAllBlockingReasons().subscribe((data) => {
      this.reasonOptions = data;
    });
  }

  getBlockData() {
    this.blockService.getBlockActiveAccount(this.loanId).subscribe({
      next: (response) => {
        this.blockData = response;
        this.blockLoanForm.patchValue(this.blockData);
        this.minDate = new Date(this.blockData.applicationDate);
        Object.keys(this.blockLoanForm.controls).forEach(controlName => {
          const control = this.blockLoanForm.get(controlName);
          if (
            ['accelerate', 'freezeCurrentInterest', 'freezeInterestArrears', 'freezeLifeInsurance', 'freezeMypime', 'active'].includes(controlName) &&
            control?.value === true
          ) {
            control.disable();
          }
        });
      },
      error: (err) => {
        this.alertService.alert({
          type: 'Ok',
          message: err.error?.defaultUserMessage
        });
      }
    })
  }

  submit() {
    const applicationDateFormatted = this.dateUtils.formatDate(this.blockLoanForm.get('applicationDate')?.value, this.settingsService.dateFormat);

    const payload = {
      ...this.blockLoanForm.value,
      locale: this.settingsService.language.code,
      dateFormat: this.settingsService.dateFormat,
      applicationDate: applicationDateFormatted

    }

    console.log(payload)

    this.blockService.updateBlockAccount(payload, this.blockData.id).subscribe({
      next: (response) => {

        this.alertService.alert({
          type: 'Ok',
          message: this.translateService.instant('labels.inputs.Lock Placed On')
        });

        this.router.navigate(['../../../general'], { relativeTo: this.route });
      },
      error: (err) => {
        this.alertService.alert({
          type: 'Ok',
          message: err.error?.defaultUserMessage
        });
      }
    })

  }

}