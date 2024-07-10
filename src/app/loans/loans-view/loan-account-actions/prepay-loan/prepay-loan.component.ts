/** Angular Imports */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';


/**
 * Loan Prepay Loan Option
 */
@Component({
  selector: 'mifosx-prepay-loan',
  templateUrl: './prepay-loan.component.html',
  styleUrls: ['./prepay-loan.component.scss']
})
export class PrepayLoanComponent implements OnInit, OnDestroy {

  @Input() dataObject: any;
  /** Loan Id */
  loanId: string;
  /** Payment Types */
  paymentTypes: any;
  /** Principal Portion */
  principalPortion: any;
  /** Interest Portion */
  interestPortion: any;
  /** Show Payment Details */
  showPaymentDetails = false;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  /** Prepay Loan form. */
  prepayLoanForm: UntypedFormGroup;

  prepayData: any;

   /** Channel List */
   channelOptions: any;
   bankOptions: any;
 
   /** Ally List */
   allyOption: any;
   /** Point Of Sales */
   pointSalesOption: any;

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
    private settingsService: SettingsService) {
      this.loanId = this.route.snapshot.params['loanId'];
    }

  /**
   * Creates the prepay loan form
   * and initialize with the required values
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createprepayLoanForm();
    this.setPrepayLoanDetails();
    this.loadChannelsForCombobox();
    this.loadAllieForComboBox();
    this.prepayData = this.dataObject;
  }

  ngOnDestroy(): void {
  }

  /**
   * Creates the prepay loan form.
   */
  createprepayLoanForm() {
    this.prepayLoanForm = this.formBuilder.group({
      'transactionDate': [new Date(), Validators.required],
      'transactionAmount': ['', Validators.required],
      'externalId': [''],
      'paymentTypeId': [''],
      'note': [''],
      'channelName':'',
      'allyId' : '',
      'pointOfSalesCode' : '',
    });
  }

  /**
   * Sets the value in the prepay loan form
   */
  setPrepayLoanDetails() {
    this.paymentTypes = this.dataObject.paymentTypeOptions;
    this.prepayLoanForm.patchValue({
      transactionAmount: this.dataObject.amount
    });
    this.prepayLoanForm.get('transactionDate').valueChanges.subscribe((transactionDate: string) => {
      const prepayDate = this.dateUtils.formatDate(transactionDate, this.settingsService.dateFormat);

      this.loanService.getLoanPrepayLoanActionTemplate(this.loanId, prepayDate)
      .subscribe((response: any) => {
        this.prepayData = response;
        this.prepayLoanForm.patchValue({
          transactionAmount: this.prepayData.amount
        });
      });
    });
  }

  /**
   * Add payment detail fields to the UI.
   */
  addPaymentDetails() {
    this.showPaymentDetails = !this.showPaymentDetails;
    if (this.showPaymentDetails) {
      this.prepayLoanForm.addControl('accountNumber', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('checkNumber', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('routingCode', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('receiptNumber', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('bankNumber', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('channelName', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('allyId', new UntypedFormControl(''));
      this.prepayLoanForm.addControl('pointOfSalesCode', new UntypedFormControl(''));

    } else {
      this.prepayLoanForm.removeControl('accountNumber');
      this.prepayLoanForm.removeControl('checkNumber');
      this.prepayLoanForm.removeControl('routingCode');
      this.prepayLoanForm.removeControl('receiptNumber');
      this.prepayLoanForm.removeControl('bankNumber');
      this.prepayLoanForm.removeControl('channelName');
      this.prepayLoanForm.removeControl('allyId');
      this.prepayLoanForm.removeControl('pointOfSalesCode');
    }
  }

  /**
   * Submits the prepay loan form
   */
  submit() {
    const prepayLoanFormData = this.prepayLoanForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevTransactionDate: Date = this.prepayLoanForm.value.transactionDate;
    if (prepayLoanFormData.transactionDate instanceof Date) {
      prepayLoanFormData.transactionDate = this.dateUtils.formatDate(prevTransactionDate, dateFormat);
    }
    delete(prepayLoanFormData['allyId']);
    const data = {
      ...prepayLoanFormData,
      dateFormat,
      locale
    };
    this.loanService.submitLoanActionButton(this.loanId, data, 'repayment')
      .subscribe((response: any) => {
        this.router.navigate(['../../general'], { relativeTo: this.route });
    });
  }

  loadChannelsForCombobox() {
  
    return this.loanService.getChannels().subscribe((data)=>{
      var paymentChannel = data.filter((key: any) =>key?.channelType?.value === 'REPAYMENT');
      this.channelOptions = paymentChannel;
    })
}

  loadAllieForComboBox() {
  return this.loanService.getAllies().subscribe((data) => {
    this.allyOption = data;
  });
}

  changeEvent() {
    const alliesId = this.prepayLoanForm.value.allyId;
    return this.loanService.getPointOfSales(alliesId).subscribe((data) => {
      this.pointSalesOption = data;
    });
  }

}
