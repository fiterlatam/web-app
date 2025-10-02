import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'app/core/alert/alert.service';
import { Dates } from 'app/core/utils/dates';
import { LoanBlockAccountService } from 'app/loans/services/loan-block-account.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-loan-unblock-account',
  templateUrl: './loan-unblock-account.component.html',
  styleUrls: ['./loan-unblock-account.component.scss']
})
export class LoanUnblockAccountComponent implements OnInit {

  /** Block Loan form. */
  unblockLoanForm: UntypedFormGroup;
  /** Loan data. */
  loanData: any = new Object();
  /** Association Data */
  associationData: any;
  /** Loan Id */
  loanId: any;
  /** Reason Options */
  reasonOptions: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private blockService: LoanBlockAccountService,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.setunblockLoanForm();
  }


  setunblockLoanForm() {
    const today = new Date();
    
    this.unblockLoanForm = this.formBuilder.group({
      'loanId': [this.loanId],
      'note': ['', Validators.required]

    });
  }

  submit() {
    const applicationDateFormatted = this.dateUtils.formatDate(this.unblockLoanForm.get('applicationDate')?.value, this.settingsService.dateFormat);

    const payload = {
      ...this.unblockLoanForm.value,
      locale: this.settingsService.language.code,
      dateFormat: this.settingsService.dateFormat,
      applicationDate: applicationDateFormatted

    }

    this.blockService.unblockAccount(payload, this.loanId).subscribe({
      next: (response) => {

        this.alertService.alert({
          type: 'Ok',
          message: this.translateService.instant('labels.inputs.Lock Removed')
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
