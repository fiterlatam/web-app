import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'mifosx-original-schedule-tab',
  templateUrl: './original-schedule-tab.component.html',
  styleUrls: ['./original-schedule-tab.component.scss']
})
export class OriginalScheduleTabComponent implements OnInit {

  /** Currency Code */
  @Input() currencyCode: string;
  /** Loan Details Data */
  originalScheduleDetails: any;
  /** Columns to be displayed in original schedule table. */
  displayedColumns: string[] = ['date', 'balanceOfLoan', 'principalDue', 'interest', 'fees', 'penalties', 'outstanding'];
  decimalPlaces: string;

  /**
   * Retrieves the loans with associations data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      if (data.loanDetailsData) {
        this.currencyCode = data.loanDetailsData.currency.code;
        this.decimalPlaces = data.loanDetailsData.currency.decimalPlaces;
      }
      this.originalScheduleDetails = data.loanDetailsData.originalSchedule;
    });
  }

  ngOnInit() {
  }

}
