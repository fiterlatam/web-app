/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {LoansService} from "../../../loans.service";
import {DomSanitizer} from "@angular/platform-browser";

/** Custom Services */
@Component({
  selector: 'mifosx-generate-disbursement-report',
  templateUrl: './generate-disbursement-report.component.html',
  styleUrls: ['./generate-disbursement-report.component.scss']
})
export class GenerateDisbursementReportComponent implements OnInit {
  loanId: any;
  pdfFileURL: any;
  /**
   * @param route
   * @param sanitizer
   * @param loanService
   */
  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private loanService: LoansService) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.loanService.generateLoanDisbursementReportPDF(this.loanId).subscribe((response: any) => {
      const pdfFileContent:Blob = new Blob([response], { type: 'application/pdf' });
      this.pdfFileURL = URL.createObjectURL(pdfFileContent);
    });
  }

  pdfURL(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
  }

}
