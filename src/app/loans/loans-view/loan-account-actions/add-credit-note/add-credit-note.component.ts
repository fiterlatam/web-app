import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoansService} from '../../../loans.service';
import {logger} from 'codelyzer/util/logger';
import {SettingsService} from '../../../../settings/settings.service';
import {switchMap} from 'rxjs/operators';
import {Dates} from '../../../../core/utils/dates';

@Component({
  selector: 'mifosx-add-credit-note',
  templateUrl: './add-credit-note.component.html',
  styleUrls: ['./add-credit-note.component.scss']
})
export class AddCreditNoteComponent implements OnInit {
  @Input() dataObject: any;
  creditNoteForm: FormGroup;
  selectedFile: File | null = null;
  maxDate = new Date();
  loanId: any;
  documentId: number;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private loansService: LoansService, private router:
    Router, private settingsService: SettingsService, private dateUtils: Dates) {
    this.loanId = this.route.snapshot.params['loanId'];
    this.creditNoteForm = this.fb.group({
      creditNoteDate: ['', Validators.required],
      arrearInterest: [0, Validators.required],
      currentInterest: [0, Validators.required],
      honorarios: [0, Validators.required],
      aval: [0, Validators.required],
      insurance: [0, Validators.required],
      capital: [0, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    console.log('File Selected:', event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        this.selectedFile = null;
        alert('Only PDF files are allowed.');
      }
    }
  }

  onSave(): void {
    if (this.creditNoteForm.valid) {
      const creditNoteData = this.creditNoteForm.value;
      const locale = this.settingsService.language.code;
      const dateFormat = this.settingsService.dateFormat;
      const creditNoteDate = this.creditNoteForm.get('creditNoteDate')?.value;
      if (creditNoteData.creditNoteDate instanceof Date) {
        creditNoteData.creditNoteDate = this.dateUtils.formatDate(creditNoteDate, dateFormat);
      }
      const creditNote = {
        loanId: this.loanId,
        documentId: this.documentId,
        creditNoteDate: creditNoteData.creditNoteDate,
        arrearInterest: creditNoteData.arrearInterest,
        currentInterest: creditNoteData.currentInterest,
        honorarios: creditNoteData.honorarios,
        aval: creditNoteData.aval,
        insurance: creditNoteData.insurance,
        capital: creditNoteData.capital,
        dateFormat,
        locale
      };

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('name', this.selectedFile.name);
        formData.append('description', 'Credit Note');

        this.loansService.loadLoanDocument(this.loanId, formData)
          .pipe(
            switchMap((res: any) => {
              this.documentId = res.resourceId;
              creditNote.documentId = this.documentId;
              return this.loansService.createLoanCreditNote(this.loanId, creditNote);
            })
          )
          .subscribe(() => {
            this.router.navigate(['../../credit-notes'], {relativeTo: this.route}).then(() => logger.info('Added Loan Credit Note successful'));
          });
      } else {
        this.loansService.createLoanCreditNote(this.loanId, creditNote).subscribe(() => {
          this.router.navigate(['../../credit-notes'], {relativeTo: this.route}).then(() => logger.info('Added Loan Credit Note successful'));
        });
      }
    }
  }


}
