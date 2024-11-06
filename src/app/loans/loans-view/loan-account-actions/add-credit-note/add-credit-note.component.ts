import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
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
      mandatoryInsurance: [0, Validators.required],
      capital: [0, Validators.required]
    }, {validators: this.atLeastOneValueGreaterThanZeroValidator()});
  }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
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
        mandatoryInsurance: creditNoteData.mandatoryInsurance,
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

  atLeastOneValueGreaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // ensure that at least one of the values is greater than zero
      const arrearInterest = control.get('arrearInterest')?.value;
      const currentInterest = control.get('currentInterest')?.value;
      const honorarios = control.get('honorarios')?.value;
      const aval = control.get('aval')?.value;
      const insurance = control.get('insurance')?.value;
      const mandatoryInsurance = control.get('mandatoryInsurance')?.value;
      const capital = control.get('capital')?.value;

      if (arrearInterest === 0 && currentInterest === 0 && honorarios === 0 && aval === 0 && insurance === 0 && capital === 0 && mandatoryInsurance === 0) {
        return {atLeastOneValueGreaterThanZero: true};
      }
      return null;
    };
  }
}
