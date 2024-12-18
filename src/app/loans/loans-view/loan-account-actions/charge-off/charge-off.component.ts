import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dates } from 'app/core/utils/dates';
import { LoansService } from 'app/loans/loans.service';
import { InsuranceIncidentService } from 'app/products/insurance-incident/insurance-incident.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-charge-off',
  templateUrl: './charge-off.component.html',
  styleUrls: ['./charge-off.component.scss']
})
export class ChargeOffComponent implements OnInit {
  @Input() dataObject: any;

  /** Loan Id */
  loanId: string;
  /** Payment Type Options */
  paymentTypes: any;
  /** Show payment details */
  showPaymentDetails = false;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  /** Repayment Loan Form */
  chargeoffLoanForm: UntypedFormGroup;

  chargeOffReasonOptions: any = [];

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {LoansService} loanService Loan Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private formBuilder: UntypedFormBuilder,
    private loanService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private settingsService: SettingsService, private incidentService: InsuranceIncidentService) {
      this.loanId = this.route.snapshot.params['loanId'];
    }

  /**
   * Creates the repayment loan form
   * and initialize with the required values
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.getNoveltyData();
    this.createChargeoffLoanForm();
  }

  /*
    getNovelty data
  */
  getNoveltyData(){
      this.incidentService.getTemplate().subscribe(data => {
        this.chargeOffReasonOptions = data?.incidentTypeOptions; // Assign the fetched data to chargeOffReasonOptions
       
      }, error => {
        
      });
  }
  /**
   * Creates the create close form.
   */
  createChargeoffLoanForm() {
    this.chargeoffLoanForm = this.formBuilder.group({
      'transactionDate': [this.settingsService.businessDate, Validators.required],
      'externalId': '',
      'chargeOffReasonId': '',
      'note': '',
      'incidentTypeId': '',
    });
  }

  submit() {
    const chargeoffLoanFormData = this.chargeoffLoanForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevTransactionDate: Date = this.chargeoffLoanForm.value.transactionDate;
    if (chargeoffLoanFormData.transactionDate instanceof Date) {
      chargeoffLoanFormData.transactionDate = this.dateUtils.formatDate(prevTransactionDate, dateFormat);
    }
    const data = {
      ...chargeoffLoanFormData,
      dateFormat,
      locale
    };
    const command = 'charge-off';
    this.loanService.submitLoanActionButton(this.loanId, data, command)
      .subscribe((response: any) => {
        this.router.navigate(['../../transactions'], { relativeTo: this.route });
    });
  }

}
