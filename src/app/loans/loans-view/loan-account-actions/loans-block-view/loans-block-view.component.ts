import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { LoanBlockAccountService } from 'app/loans/services/loan-block-account.service';
@Component({
  selector: 'mifosx-loans-block-view-account',
  templateUrl: './loans-block-view.component.html',
  styleUrls: ['./loans-block-view.component.css']
})
export class LoansBlockViewAccountComponent implements OnInit {

  /** Loan Id */
  loanId: any;

  /** Reason Options */
  blockData: any;
  
    constructor(
      private route: ActivatedRoute,
      private blockService: LoanBlockAccountService,
      private alertService: AlertService) {
      this.loanId = this.route.snapshot.params['loanId'];
    }

  ngOnInit() {
    this.getBlockData();
  }

  getBlockData() {
    this.blockService.getBlockActiveAccount(this.loanId).subscribe({
      next: (response) => {
        this.blockData = response;
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
