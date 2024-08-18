import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';

@Component({
  selector: 'mifosx-repayment-schedule-tab',
  templateUrl: './repayment-schedule-tab.component.html',
  styleUrls: ['./repayment-schedule-tab.component.scss']
})
export class RepaymentScheduleTabComponent implements OnInit {

  /** Currency Code */
  @Input() currencyCode: string;
  /** Loan Repayment Schedule to be Edited */
  @Input() forEditing = false;
  /** Loan Repayment Schedule Details Data */
  @Input() repaymentScheduleDetails: any = null;
  loanDetailsDataRepaymentSchedule: any = [];

  /** Stores if there is any waived amount */
  isWaived: boolean;
  /** Columns to be displayed in original schedule table. */
  displayedColumns: string[] = ['number', 'days', 'date', 'paiddate', 'check', 'balanceOfLoan', 'principalDue', 'interest', 'voluntary.insurance', 'mandatory.insurance', 'aval', 'fees', 'penalties', 'due', 'paid', 'inadvance', 'late', 'waived', 'outstanding'];
  /** Columns to be displayed in editable schedule table. */
  displayedColumnsEdit: string[] = ['number', 'date', 'balanceOfLoan', 'principalDue', 'interest', 'fees', 'due'];

  /** Form functions event */
  @Output() editPeriod = new EventEmitter();

  locale: string;
  format: string;
  decimalPlaces: string;

  /**
   * Retrieves the loans with associations data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param settingsService
   */
  constructor(private route: ActivatedRoute,
              private settingsService: SettingsService) {
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      if (data.loanDetailsData) {
        this.currencyCode = data.loanDetailsData.currency.code;
        this.decimalPlaces = data.loanDetailsData.currency.decimalPlaces;
      }
      this.loanDetailsDataRepaymentSchedule = data.loanDetailsData ? data.loanDetailsData.repaymentSchedule : [];
    });
  }

  ngOnInit() {
    this.locale = this.settingsService.language.code;
    if (this.decimalPlaces == null) {
      this.decimalPlaces = this.settingsService.decimals;
    }
    this.format = `1.${this.decimalPlaces}-${ this.decimalPlaces}`;
    if (this.repaymentScheduleDetails == null) {
      this.repaymentScheduleDetails = this.loanDetailsDataRepaymentSchedule;
    }
    this.isWaived = this.repaymentScheduleDetails.totalWaived > 0;
  }

  installmentStyle(installment: any): string {
    if (installment.isAdditional) {
      return 'additional';
    }
    return '';
  }

}
