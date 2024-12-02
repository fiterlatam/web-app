import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

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
  displayedColumns: string[] = ['number', 'date', 'balanceOfLoan', 'principalDue', 'interest', 'voluntary.insurance', 'mandatory.insurance', 'aval', 'fees', 'penalties', 'outstanding'];
  decimalPlaces: string;
  loanId: string;
  clientId: string;

  /**
   * Retrieves the loans with associations data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      if (data.loanDetailsData) {
        this.loanId = data.loanDetailsData.id;
        this.clientId = data.loanDetailsData.clientId;
        this.currencyCode = data.loanDetailsData.currency.code;
        this.decimalPlaces = data.loanDetailsData.currency.decimalPlaces;
      }
      this.originalScheduleDetails = data.loanDetailsData.originalSchedule;
    });
  }

  ngOnInit() {
  }

  exportSchedule(): void {
    // Navigate to the specific URL
    this.router.navigateByUrl(`/clients/${this.clientId}/loans-accounts/${this.loanId}/actions/Generate Original Schedule Report`);
  }

}
