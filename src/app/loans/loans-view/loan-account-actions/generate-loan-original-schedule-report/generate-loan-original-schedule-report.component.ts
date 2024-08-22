import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {LoansService} from '../../../loans.service';

@Component({
  selector: 'mifosx-generate-loan-original-schedule-report',
  templateUrl: './generate-loan-original-schedule-report.component.html',
  styleUrls: ['./generate-loan-original-schedule-report.component.scss']
})
export class GenerateLoanOriginalScheduleReportComponent implements OnInit {
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
    this.loanService.generateLoanOriginalScheduleReportPDF(this.loanId).subscribe((response: any) => {
      const pdfFileContent:Blob = new Blob([response], { type: 'application/pdf' });
      this.pdfFileURL = URL.createObjectURL(pdfFileContent);
    });
  }

  pdfURL(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
  }

}
