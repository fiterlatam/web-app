import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dates } from 'app/core/utils/dates';
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-block-loan',
  templateUrl: './block-loan.component.html',
  styleUrls: ['./block-loan.component.scss']
})
export class BlockLoanComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();

  blockSetting: any[] = [];
  blockForm: UntypedFormGroup;

  /** When selected drop down will not be active and we can deelte everything availalbe */
  checkboxValue: boolean = false;

  loanId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private loansService: LoansService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.blockSetting.push(route.snapshot.data.actionButtonData);
    this.loanId = route.snapshot.params.loanId;
  }

  ngOnInit(): void {
    this.createBlockForm();
  }

  /**
   * Creates the block loan form.
   */
  createBlockForm() {
    this.blockForm = this.formBuilder.group({
      blockDate: ["", Validators.required],
      blockingReasonId: [this.blockSetting[0].id],
      blockComment: ["", [Validators.required, Validators.maxLength(255)]],
    });

  }

  /** Submits the form and unblocks the client.
   */
  submit() {
    const blockLoanForm = this.blockForm.value;

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevBlockedDate: Date = this.blockForm.value.blockDate;

    if (blockLoanForm.blockDate instanceof Date) {
      blockLoanForm.blockDate = this.dateUtils.formatDate(prevBlockedDate, dateFormat);
    }

    const data = {
      ...blockLoanForm,
      dateFormat,
      locale,
    };
    this.loansService.blockLoanAccount(this.loanId, data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
