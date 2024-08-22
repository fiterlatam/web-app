/** Angular Imports. */
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

/**
 * Loan Account Actions component.
 */
@Component({
  selector: 'mifosx-loan-account-actions',
  templateUrl: './loan-account-actions.component.html',
  styleUrls: ['./loan-account-actions.component.scss']
})
export class LoanAccountActionsComponent {

  /** flag object to store possible actions and render appropriate UI to the user */
  actions: {
    'Close': boolean,
    'Undo Approval': boolean,
    'Write Off': boolean,
    'Add Collateral': boolean,
    'Assign Loan Officer': boolean,
    'Foreclosure': boolean,
    'Prepay Loan': boolean,
    'Reject': boolean,
    'Disburse to Savings': boolean,
    'Make Repayment': boolean,
    'Waive Interest': boolean,
    'Close (as Rescheduled)': boolean,
    'Reschedule': boolean,
    'Recovery Payment': boolean,
    'View Guarantors': boolean,
    'Create Guarantor': boolean,
    'Disburse': boolean,
    'Withdrawn by Client': boolean,
    'Undo Disbursal': boolean,
    'Undo Last Disbursal': boolean,
    'Loan Screen Reports': boolean,
    'Approve': boolean,
    'Add Loan Charge': boolean,
    'Goodwill Credit': boolean,
    'Merchant Issued Refund': boolean,
    'Payout Refund': boolean,
    'Credit Balance Refund': boolean,
    'Edit Repayment Schedule': boolean,
    'Charge-Off': boolean,
    'Undo Charge-Off': boolean,
    'Sell Loan': boolean,
    'Generate Disbursement Report': boolean,
    'Generate Original Schedule Report': boolean,
    'Generate Repayment Schedule Report': boolean,
    'Buy Back Loan': boolean,
    'Re-Ageing': boolean,
    'Unblock': boolean
  } = {
    'Close': false,
    'Undo Approval': false,
    'Write Off': false,
    'Add Collateral': false,
    'Assign Loan Officer': false,
    'Foreclosure': false,
    'Prepay Loan': false,
    'Reject': false,
    'Disburse to Savings': false,
    'Make Repayment': false,
    'Waive Interest': false,
    'Close (as Rescheduled)': false,
    'Reschedule': false,
    'Recovery Payment': false,
    'View Guarantors': false,
    'Create Guarantor': false,
    'Disburse': false,
    'Withdrawn by Client': false,
    'Undo Disbursal': false,
    'Undo Last Disbursal': false,
    'Loan Screen Reports': false,
    'Approve': false,
    'Add Loan Charge': false,
    'Goodwill Credit': false,
    'Merchant Issued Refund': false,
    'Payout Refund': false,
    'Credit Balance Refund': false,
    'Edit Repayment Schedule': false,
    'Charge-Off': false,
    'Undo Charge-Off': false,
    'Sell Loan': false,
    'Generate Disbursement Report': false,
    'Generate Original Schedule Report': false,
    'Generate Repayment Schedule Report': false,
    'Buy Back Loan': false,
    'Re-Ageing': false,
    'Unblock': false
  };

  actionButtonData: any;
  actionName: any;

  /**
   * @param route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    console.log('LoanAccountActionsComponent');
    this.route.data.subscribe((data: { actionButtonData: any }) => {
      this.actionButtonData = data.actionButtonData;
    });

    this.route.params.subscribe(params => {
      this.actionName = params['action'];
      if (this.actionName === 'Change Loan Officer') {
        this.actionName = 'Assign Loan Officer';
      }
      for (const key of Object.keys(this.actions)) {
        this.actions[key] = false;
      }
      console.log('this.actions', this.actions);
      this.actions[this.actionName] = true;
    });
  }

}
