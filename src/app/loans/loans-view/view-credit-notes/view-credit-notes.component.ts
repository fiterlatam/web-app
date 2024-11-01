import {Component, OnInit} from '@angular/core';
import {LoansService} from '../../loans.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'mifosx-view-credit-notes',
  templateUrl: './view-credit-notes.component.html',
  styleUrls: ['./view-credit-notes.component.scss']
})
export class ViewCreditNotesComponent implements OnInit {
  loanId: any;
  creditNotes: any[] = [];
  displayedColumns: string[] = ['date', 'arrearInterest', 'currentInterest', 'honorarios', 'aval', 'insurance', 'capital', 'actions'];

  constructor(private loansService: LoansService, private route: ActivatedRoute) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit(): void {
    // Get the resolved data
    this.creditNotes = this.route.snapshot.data['creditNoteData'];
  }


  downloadAttachment(attachmentId: string, loanId: string): void {
    // Logic to view the attachment
    this.loansService.downloadLoanDocument(loanId, attachmentId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      window.open(url);
    });
  }
}
