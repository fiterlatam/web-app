import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'app/core/alert/alert.service';
import { Dates } from 'app/core/utils/dates';
import { LoansService } from 'app/loans/loans.service';
import { LoanBlockAccountService } from 'app/loans/services/loan-block-account.service';
import { SettingsService } from 'app/settings/settings.service';
import { SystemService } from 'app/system/system.service';

@Component({
  selector: 'mifosx-loans-block-account',
  templateUrl: './loans-block-account.component.html',
  styleUrls: ['./loans-block-account.component.css']
})
export class LoansBlockAccountComponent implements OnInit {

  /** Block Loan form. */
  blockLoanForm: UntypedFormGroup;
  /** Loan data. */
  loanData: any = new Object();
  /** Association Data */
  associationData: any;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Loan Id */
  loanId: any;
  /** Reason Options */
  reasonOptions: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private blockService: LoanBlockAccountService,
    private settingsService: SettingsService,
    private systemService: SystemService,
    private dateUtils: Dates,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.setBlockLoanForm();
    this.getReasons();
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

  submit() {
    const applicationDateFormatted = this.dateUtils.formatDate(this.blockLoanForm.get('applicationDate')?.value, this.settingsService.dateFormat);

    const payload = {
      ...this.blockLoanForm.value,
      locale: this.settingsService.language.code,
      dateFormat: this.settingsService.dateFormat,
      applicationDate: applicationDateFormatted

    }

    console.log(payload)

    this.blockService.createBlockAccount(payload, this.loanId).subscribe({
      next: (response) => {

        this.alertService.alert({
          type: 'Ok',
          message: this.translateService.instant('labels.inputs.Lock Placed On')
        });

        this.router.navigate(['../../general'],{ relativeTo: this.route });
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
