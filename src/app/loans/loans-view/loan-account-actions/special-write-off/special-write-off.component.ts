import { Component, OnInit, Input } from '@angular/core';
import {
  UntypedFormGroup,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder, Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';
import {logger} from 'codelyzer/util/logger';
import {Currency} from '../../../../shared/models/general.model';
@Component({
  selector: 'mifosx-special-write-off',
  templateUrl: './special-write-off.component.html',
  styleUrls: ['./special-write-off.component.scss']
})
export class SpecialWriteOffComponent implements OnInit {

  @Input() dataObject: any;
  specialWriteOffForm: UntypedFormGroup;
  displayedColumns: string[] = ['name', 'outstandingBalance', 'writeOffAmount'];
  dataSource: any[];
  currency: Currency;
  locale: string;
  format: string;
  decimalPlace: string;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private loanService: LoansService,
              private router: Router,
              private settingsService: SettingsService) { }

  ngOnInit() {
    this.currency = this.dataObject.currency;
    this.locale = this.settingsService.language.code;
    this.decimalPlace = this.settingsService.decimals;
    this.format = `1.${this.decimalPlace}-${ this.decimalPlace}`;
    this.setWriteOffForm();
  }

  getConcepts(): FormGroup[] {
    const concepts = [
      {
        name: 'labels.inputs.Current Principal',
        amountOutstanding: this.dataObject.principalPortion,
        writeOffAmount: this.dataObject.principalPortion,
        chargeId: '',
        readOnly: false
      },
      {
        name: 'labels.inputs.Current Interest',
        amountOutstanding: this.dataObject.interestPortion,
        writeOffAmount: this.dataObject.interestPortion,
        chargeId: '',
        readOnly: false
      }
    ];
    const currentOutstandingLoanCharges = this.dataObject.currentOutstandingLoanCharges || [];
    concepts.push(...currentOutstandingLoanCharges.map((charge: any) => {
      return {
        name: charge.name,
        amountOutstanding: charge.amountOutstanding,
        writeOffAmount: charge.amountOutstanding,
        chargeId: charge.chargeId,
        readOnly: false
      };
    }));
    console.log('concepts', concepts);
    const totalOutstandingAmount = concepts.reduce((acc, curr) => acc + curr.amountOutstanding, 0);
    concepts.push({
      name: 'labels.inputs.Total',
      amountOutstanding: totalOutstandingAmount,
      writeOffAmount: totalOutstandingAmount,
      chargeId: '',
      readOnly: true
    });
    return concepts.map(concept => this.formBuilder.group({
      name: new FormControl(concept.name),
      amountOutstanding: new FormControl(concept.amountOutstanding),
      writeOffAmount: new FormControl(concept.writeOffAmount, [Validators.required, Validators.min(concept.readOnly ? 0.01 : 0), Validators.max(concept.amountOutstanding)]),
      chargeId: new FormControl(concept.chargeId),
      readOnly: new FormControl(concept.readOnly)
    }));
  }

  setWriteOffForm() {
    this.specialWriteOffForm = this.formBuilder.group({
      concepts: this.formBuilder.array(this.getConcepts())
    });
  }

  get concepts(): FormArray {
    return this.specialWriteOffForm.get('concepts') as FormArray;
  }

  writeOffAmountChangeEvent() {
    const concepts = this.specialWriteOffForm.value.concepts;
    let totalWriteOffAmount = 0;
    for (let i = 0; i < concepts.length; i++) {
        if (concepts[i].name !== 'labels.inputs.Total') {
          totalWriteOffAmount += concepts[i].writeOffAmount;
        } else {
          concepts[i].writeOffAmount = totalWriteOffAmount;
        }
    }
    this.specialWriteOffForm.patchValue({
      concepts: concepts
    });
  }

  submit() {
    const concepts = this.specialWriteOffForm.value.concepts;
    const specialWriteOffData: {loanId: any, charges: any[]} = {
      loanId: this.dataObject.loanId,
      charges: [],
    };
    for (let i = 0; i < concepts.length; i++) {
          if (concepts[i].name === 'labels.inputs.Current Principal') {
            specialWriteOffData['principalPortion'] = concepts[i].writeOffAmount;
          }
          if (concepts[i].name === 'labels.inputs.Current Interest') {
            specialWriteOffData['interestPortion'] = concepts[i].writeOffAmount;
          }
          if (concepts[i].name === 'labels.inputs.Total') {
            specialWriteOffData['totalWriteOffAmount'] = concepts[i].writeOffAmount;
          }
          if (concepts[i].chargeId) {
            specialWriteOffData.charges.push({
              chargeId: concepts[i].chargeId,
              writeOffAmount: concepts[i].writeOffAmount
            });
          }
    }
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const data = {
      ...specialWriteOffData,
      dateFormat,
      locale
    };
    const loanId = this.route.snapshot.params['loanId'];
    this.loanService.submitLoanActionButton(loanId, data, 'special-write-off').subscribe(() => {
      this.router.navigate(['../../general'], {relativeTo: this.route}).then(() => logger.info('Special Write Off successful'));
    });
  }
}
