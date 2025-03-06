import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Dates} from '../../core/utils/dates';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {SettingsService} from '../../settings/settings.service';
import {ClientsService} from '../clients.service';
import {Commons} from '../../core/utils/commons';
import {LoansService} from '../../loans/loans.service';
import {LoansRestructureService} from '../../loans/loans.restructure.service';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {FormatNumberPipe} from '../../pipes/format-number.pipe';

@Component({
  selector: 'mifosx-loans-restructure-view',
  templateUrl: './loans-restructure-view.component.html',
  styleUrls: ['./loans-restructure-view.component.scss']
})
export class LoansRestructureViewComponent implements OnInit {
  /** Approve Loan form. */
  restructureLoanForm: UntypedFormGroup;
  /** Loan data. */
  loanData: any = new Object();
  /** Association Data */
  associationData: any;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** client Id */
  clientId: any;
  /** Loan Accounts Data */
  loanAccounts: any;
  /** Product Data */
  productData: any;
  formData: any = {};
  loansAccountProductTemplate: any;
  clientData: any;
  restructureRequest: any;
  restructureProduct: any;
  selectedLoanAccounts: any = [];
  // Selected loan accounts
  @ViewChild('selectLoans') selectLoans: MatSelectionList;
  constructor(private formBuilder: UntypedFormBuilder,
              private settingsService: SettingsService,
              private loansRestructureService: LoansRestructureService,
              private loansService: LoansService,
              private route: ActivatedRoute,
              public translateService: TranslateService,
              public formatNumberPipe: FormatNumberPipe,
              public dialog: MatDialog,
              private dateUtils: Dates,
              private commons: Commons,
              private router: Router) {
    this.clientId = this.route.snapshot.params['clientId'];
    this.route.data.subscribe((data: { restructureTemplateData: any}) => {
      this.loanAccounts = data.restructureTemplateData.activeLoans.filter((account: any) => account.status.id === 300);
      this.productData = data.restructureTemplateData.loanProductData.sort(this.commons.dynamicSort('name'));
      this.clientData = data.restructureTemplateData.clientData;
      this.restructureRequest = data.restructureTemplateData.requestData;
      if (this.restructureRequest != null) {
        this.buildDependencies(this.restructureRequest.productId);
      }
    });
  }

  ngOnInit(): void {
    this.setRestructureForm();
  }

  buildDependencies(productId: any) {
    const entityId = this.clientId;
    const isGroup = false;
      this.loansService.getLoansAccountTemplateResource(entityId, isGroup, productId).subscribe((response: any) => {
        this.loansAccountProductTemplate = response;

        // this.charges = response.charges || [];
        this.formData.disbursementData = response.disbursementDetails || [];

        if (response.calendarOptions) {
          this.formData.syncRepaymentsWithMeeting = true;
          this.formData.syncDisbursementWithMeeting = true;
        }
        const loanProduct = response.product;
        this.restructureProduct = loanProduct;
        this.formData.productId = loanProduct.id;
        this.formData.fundId = response.fundId;
        this.formData.principal = response.principal;
        this.formData.loanTermFrequency = response.termFrequency;
        this.formData.loanTermFrequencyType = response.termPeriodFrequencyType.id;
        this.formData.numberOfRepayments = response.numberOfRepayments;
        this.formData.repaymentEvery = response.repaymentEvery;
        this.formData.repaymentFrequencyType = response.repaymentFrequencyType.id;
        this.formData.interestRatePerPeriod = response.interestRatePerPeriod;
        this.formData.amortizationType = response.amortizationType.id;
        this.formData.fixedPrincipalPercentagePerInstallment = response.fixedPrincipalPercentagePerInstallment;
        this.formData.isEqualAmortization = response.isEqualAmortization;
        this.formData.interestType = response.interestType.id;
        this.formData.interestCalculationPeriodType = response.interestCalculationPeriodType.id;
        this.formData.allowPartialPeriodInterestCalcualtion = response.allowPartialPeriodInterestCalcualtion;
        this.formData.inArrearsTolerance = response.inArrearsTolerance;
        this.formData.graceOnPrincipalPayment = response.graceOnPrincipalPayment;
        this.formData.graceOnInterestPayment = response.graceOnInterestPayment;
        this.formData.graceOnArrearsAgeing = response.graceOnArrearsAgeing;
        this.formData.transactionProcessingStrategyId = response.transactionProcessingStrategyId;
        this.formData.graceOnInterestCharged = response.graceOnInterestCharged;
        this.formData.fixedEmiAmount = response.fixedEmiAmount;
        this.formData.maxOutstandingLoanBalance = response.maxOutstandingLoanBalance;
        this.formData.transactionProcessingStrategyCode = response.transactionProcessingStrategyCode;
        if (response.isLoanProductLinkedToFloatingRate) {
          this.formData.isFloatingInterestRate = false;
        }
        this.formData.rates = loanProduct.rates;
      });
  }

  submit() {
    const restructureData = this.restructureLoanForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const expectedDisbursementDate: Date = this.restructureLoanForm.value.expectedDisbursementDate;
    if (restructureData.expectedDisbursementDate instanceof Date) {
      restructureData.expectedDisbursementDate = this.dateUtils.formatDate(expectedDisbursementDate, dateFormat);
    }
    const selectedLoanAccounts = this.selectedLoanAccounts;
    const data = {
      comments: restructureData.note,
      productId: restructureData.productId,
      clientId: this.clientId,
      selectedLoanIds: selectedLoanAccounts,
      disbursementDate: restructureData.expectedDisbursementDate,
      outstandingBalance: restructureData.totalLoanAmount,
      dateFormat,
      locale
    };
    this.loansRestructureService.restructureLoans(this.clientId, data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }

  private setRestructureForm() {
    this.restructureLoanForm = this.formBuilder.group({
      'expectedDisbursementDate': ['', Validators.required],
      'totalLoanAmount': [{ value: 0, disabled: true }, Validators.required],
      'productId': [''],
      'note': ['']
    });
  }

  onLoanSelectionChange($event: MatSelectionListChange) {
    const selectedIndexes = this.selectLoans.selectedOptions.selected.map(option => {
      return this.selectLoans.options.toArray().indexOf(option);
    });

    // Compute total loan balance from the loanAcccounts using selected indexes
    let totalLoanBalance = 0;
    this.selectedLoanAccounts = [];
    selectedIndexes.forEach(index => {
      totalLoanBalance += this.loanAccounts[index].summary.totalOutstanding;
      this.selectedLoanAccounts.push(this.loanAccounts[index].id);
    });
    // assign totalLoanBalance to totalLoanAmount form control
    this.restructureLoanForm.get('totalLoanAmount').setValue(totalLoanBalance);

    console.log('Loan Selection Changed', selectedIndexes);
  }

  approveRestructure(action: string) {
    const header = action === 'APPROVE' ? this.translateService.instant('labels.heading.Approve Restructure') : this.translateService.instant('labels.heading.Reject Restructure');
    const context = action === 'APPROVE' ?
      this.translateService.instant('labels.dialogContext.Are you sure you want Approve the Loan restructure') + `\n ` +
      this.translateService.instant('labels.dialogContext.Approval will Close the selected Loans and create a new loan with total amount of') + this.formatNumberPipe.transform(this.restructureRequest.totalLoanAmount) + ')' :
      this.translateService.instant('labels.dialogContext.Are you sure you want Reject the Loan restructure');
    const approveResucture = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        heading: header,
        dialogContext: context
      }
    });
    approveResucture.afterClosed().subscribe((response: { confirm: any }) => {
      const controller: any = this;
      const locale = this.settingsService.language.code;
      const dateFormat = this.settingsService.dateFormat;
      const transactionDate: any = this.dateUtils.formatDate(new Date(), dateFormat);
      if (response.confirm) {
        if (this.restructureProduct.requirePoints) {
          this.formData.interestRatePoints = 1;
        }
        const formData = {
          requestId: controller.restructureRequest.id,
          transactionDate,
          notes : controller.restructureRequest.comments,
          locale,
          dateFormat,
          loanData: {...controller.formData,
            loanType : 'individual',
            clientId: controller.clientId,
            principal: controller.restructureRequest.totalLoanAmount}
        };
        this.loansRestructureService.executeClientCommand(this.clientId, action.toLowerCase(), formData).subscribe(() => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        });
      }
    });
  }
}
