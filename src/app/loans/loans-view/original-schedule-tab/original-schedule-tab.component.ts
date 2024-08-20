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
  displayedColumns: string[] = ['date', 'balanceOfLoan', 'principalDue', 'interest', 'voluntary.insurance', 'mandatory.insurance', 'aval', 'fees', 'penalties', 'outstanding'];
  decimalPlaces: string;
  loanId: any;

  /**
   * Retrieves the loans with associations data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      if (data.loanDetailsData) {
       this.loanId = data.loanDetailsData.id;
        this.currencyCode = data.loanDetailsData.currency.code;
        this.decimalPlaces = data.loanDetailsData.currency.decimalPlaces;
      }
      this.originalScheduleDetails = data.loanDetailsData.originalSchedule;
    });
  }

  ngOnInit() {
  }

  exportSchedule(): void {
    // get the loan id
    console.log('Exporting original schedule for loan id: ' + this.loanId);
    // route to generate disbursement report

    // Navigate to the specific URL
    // this.router.navigateByUrl('/clients/29/loans-accounts/194/actions/Generate%20Disbursement%20Report');
  }

}
