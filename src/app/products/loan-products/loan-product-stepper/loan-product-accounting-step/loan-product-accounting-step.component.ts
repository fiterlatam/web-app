import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';

@Component({
  selector: 'mifosx-loan-product-accounting-step',
  templateUrl: './loan-product-accounting-step.component.html',
  styleUrls: ['./loan-product-accounting-step.component.scss']
})
export class LoanProductAccountingStepComponent implements OnInit {

  @Input() loanProductsTemplate: any;
  @Input() accountingRuleData: any;
  @Input() loanProductFormValid: boolean;

  loanProductAccountingForm: UntypedFormGroup;

  chargeData: any;
  penaltyData: any;
  paymentTypeData: any;
  assetAccountData: any;
  incomeAccountData: any;
  expenseAccountData: any;
  liabilityAccountData: any;
  incomeAndLiabilityAccountData: any;
  assetAndLiabilityAccountData: any;

  paymentFundSourceDisplayedColumns: string[] = ['paymentTypeId', 'fundSourceAccountId', 'actions'];
  feesPenaltyIncomeDisplayedColumns: string[] = ['chargeId', 'incomeAccountId', 'actions'];

  constructor(private formBuilder: UntypedFormBuilder,
              public dialog: MatDialog) {
    this.createLoanProductAccountingForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.chargeData = this.loanProductsTemplate.chargeOptions || [];
    this.penaltyData = this.loanProductsTemplate.penaltyOptions || [];
    this.paymentTypeData = this.loanProductsTemplate.paymentTypeOptions || [];
    this.assetAccountData = this.loanProductsTemplate.accountingMappingOptions.assetAccountOptions || [];
    this.incomeAccountData = this.loanProductsTemplate.accountingMappingOptions.incomeAccountOptions || [];
    this.expenseAccountData = this.loanProductsTemplate.accountingMappingOptions.expenseAccountOptions || [];
    this.liabilityAccountData = this.loanProductsTemplate.accountingMappingOptions.liabilityAccountOptions || [];

    // First combine the arrays, then transform the data
    this.incomeAndLiabilityAccountData = [...this.incomeAccountData, ...this.liabilityAccountData];
    this.assetAndLiabilityAccountData = [...this.assetAccountData, ...this.liabilityAccountData];

    // Transform account data to the correct format
    const transformAccount = (account: any) => ({
      id: account.id,
      name: account.name,
      glCode: account.glCode,
      disabled: account.disabled,
      manualEntriesAllowed: account.manualEntriesAllowed,
      type: account.type,
      usage: account.usage,
      description: account.description
    });

    this.assetAccountData = this.assetAccountData.map(transformAccount);
    this.incomeAccountData = this.incomeAccountData.map(transformAccount);
    this.expenseAccountData = this.expenseAccountData.map(transformAccount);
    this.liabilityAccountData = this.liabilityAccountData.map(transformAccount);
    this.assetAndLiabilityAccountData = this.assetAndLiabilityAccountData.map(transformAccount);
    this.incomeAndLiabilityAccountData = this.incomeAndLiabilityAccountData.map(transformAccount);

    this.loanProductAccountingForm.patchValue({
      'accountingRule': this.loanProductsTemplate.accountingRule.id
    });

    const accountingMappings = this.loanProductsTemplate.accountingMappings;
    if (accountingMappings) {
      switch (this.loanProductsTemplate.accountingRule.id) {
        case 3:
        case 4:
          this.loanProductAccountingForm.patchValue({
            'receivableInterestAccountId': accountingMappings.receivableInterestAccount?.id,
            'receivableFeeAccountId': accountingMappings.receivableFeeAccount?.id,
            'receivablePenaltyAccountId': accountingMappings.receivablePenaltyAccount?.id,
          });
          /* falls through */
        case 2:
          this.loanProductAccountingForm.patchValue({
            'fundSourceAccountId': accountingMappings.fundSourceAccount?.id,
            'loanPortfolioAccountId': accountingMappings.loanPortfolioAccount?.id,
            'transfersInSuspenseAccountId': accountingMappings.transfersInSuspenseAccount?.id,
            'interestOnLoanAccountId': accountingMappings.interestOnLoanAccount?.id,
            'incomeFromFeeAccountId': accountingMappings.incomeFromFeeAccount?.id,
            'incomeFromPenaltyAccountId': accountingMappings.incomeFromPenaltyAccount?.id,
            'incomeFromRecoveryAccountId': accountingMappings.incomeFromRecoveryAccount?.id,
            'writeOffAccountId': accountingMappings.writeOffAccount?.id,
            'goodwillCreditAccountId': accountingMappings.goodwillCreditAccount?.id,
            'overpaymentLiabilityAccountId': accountingMappings.overpaymentLiabilityAccount?.id,
            'chargeOffFraudExpenseAccountId': accountingMappings.chargeOffFraudExpenseAccount?.id || '',
            'chargeOffExpenseAccountId': accountingMappings.chargeOffExpenseAccount?.id || '',
            'incomeFromChargeOffPenaltyAccountId': accountingMappings.incomeFromChargeOffPenaltyAccount?.id || '',
            'incomeFromChargeOffFeesAccountId': accountingMappings.incomeFromChargeOffFeesAccount?.id || '',
          });
          break;
      }
    }
  }

  createLoanProductAccountingForm() {
    this.loanProductAccountingForm = this.formBuilder.group({
      'accountingRule': [1]
    });
  }

  setConditionalControls() {
    this.loanProductAccountingForm.get('accountingRule').valueChanges
      .subscribe((accountingRule: any) => {
        if (accountingRule >= 2 && accountingRule <= 4) {
          this.loanProductAccountingForm.addControl('fundSourceAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('loanPortfolioAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('transfersInSuspenseAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('interestOnLoanAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromFeeAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromPenaltyAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromRecoveryAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('writeOffAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('goodwillCreditAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('overpaymentLiabilityAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('advancedAccountingRules', new UntypedFormControl(false));
          this.loanProductAccountingForm.addControl('chargeOffFraudExpenseAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('chargeOffExpenseAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromChargeOffPenaltyAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromChargeOffFeesAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromChargeOffInterestAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromGoodwillCreditInterestAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromGoodwillCreditFeesAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('incomeFromGoodwillCreditPenaltyAccountId', new UntypedFormControl('', Validators.required));

          this.loanProductAccountingForm.get('advancedAccountingRules').valueChanges
            .subscribe((advancedAccountingRules: boolean) => {
              if (advancedAccountingRules) {
                this.loanProductAccountingForm.addControl('paymentChannelToFundSourceMappings', this.formBuilder.array([]));
                this.loanProductAccountingForm.addControl('feeToIncomeAccountMappings', this.formBuilder.array([]));
                this.loanProductAccountingForm.addControl('penaltyToIncomeAccountMappings', this.formBuilder.array([]));
              } else {
                this.loanProductAccountingForm.removeControl('paymentChannelToFundSourceMappings');
                this.loanProductAccountingForm.removeControl('feeToIncomeAccountMappings');
                this.loanProductAccountingForm.removeControl('penaltyToIncomeAccountMappings');
              }
            });
        } else {
          this.loanProductAccountingForm.removeControl('fundSourceAccountId');
          this.loanProductAccountingForm.removeControl('loanPortfolioAccountId');
          this.loanProductAccountingForm.removeControl('transfersInSuspenseAccountId');
          this.loanProductAccountingForm.removeControl('interestOnLoanAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromFeeAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromPenaltyAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromRecoveryAccountId');
          this.loanProductAccountingForm.removeControl('writeOffAccountId');
          this.loanProductAccountingForm.removeControl('goodwillCreditAccountId');
          this.loanProductAccountingForm.removeControl('overpaymentLiabilityAccountId');
          this.loanProductAccountingForm.removeControl('advancedAccountingRules');
          this.loanProductAccountingForm.removeControl('chargeOffExpenseAccountId');
          this.loanProductAccountingForm.removeControl('chargeOffFraudExpenseAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromChargeOffPenaltyAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromChargeOffFeesAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromChargeOffInterestAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromGoodwillCreditInterestAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromGoodwillCreditFeesAccountId');
          this.loanProductAccountingForm.removeControl('incomeFromGoodwillCreditPenaltyAccountId');
        }

        if (accountingRule === 3 || accountingRule === 4) {
          this.loanProductAccountingForm.addControl('receivableInterestAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('receivableFeeAccountId', new UntypedFormControl('', Validators.required));
          this.loanProductAccountingForm.addControl('receivablePenaltyAccountId', new UntypedFormControl('', Validators.required));
        } else {
          this.loanProductAccountingForm.removeControl('receivableInterestAccountId');
          this.loanProductAccountingForm.removeControl('receivableFeeAccountId');
          this.loanProductAccountingForm.removeControl('receivablePenaltyAccountId');
        }
      });
  }

  get paymentChannelToFundSourceMappings(): UntypedFormArray {
    return this.loanProductAccountingForm.get('paymentChannelToFundSourceMappings') as UntypedFormArray;
  }

  get feeToIncomeAccountMappings(): UntypedFormArray {
    return this.loanProductAccountingForm.get('feeToIncomeAccountMappings') as UntypedFormArray;
  }

  get penaltyToIncomeAccountMappings(): UntypedFormArray {
    return this.loanProductAccountingForm.get('penaltyToIncomeAccountMappings') as UntypedFormArray;
  }

  setLoanProductAccountingFormDirty() {
    if (this.loanProductAccountingForm.pristine) {
      this.loanProductAccountingForm.markAsDirty();
    }
  }

  add(formType: string, formArray: UntypedFormArray) {
    const data = { ...this.getData(formType), pristine: false };
    const dialogRef = this.dialog.open(FormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        formArray.push(response.data);
        this.setLoanProductAccountingFormDirty();
      }
    });
  }

  edit(formType: string, formArray: UntypedFormArray, index: number) {
    const data = { ...this.getData(formType, formArray.at(index).value), layout: { addButtonText: 'Edit' } };
    const dialogRef = this.dialog.open(FormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        formArray.at(index).patchValue(response.data.value);
        this.setLoanProductAccountingFormDirty();
      }
    });
  }

  delete(formArray: UntypedFormArray, index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `this` }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        formArray.removeAt(index);
        this.setLoanProductAccountingFormDirty();
      }
    });
  }

  getData(formType: string, values?: any) {
    switch (formType) {
      case 'PaymentFundSource': return { title: 'Configure Fund Sources for Payment Channels', formfields: this.getPaymentFundSourceFormfields(values) };
      case 'FeesIncome': return { title: 'Map Fees to Income Accounts', formfields: this.getFeesIncomeFormfields(values) };
      case 'PenaltyIncome': return { title: 'Map Penalties to Specific Income Accounts', formfields: this.getPenaltyIncomeFormfields(values) };
    }
  }

  getPaymentFundSourceFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'paymentTypeId',
        label: 'Payment Type',
        value: values ? values.paymentTypeId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.paymentTypeData.map((type: any) => ({
            id: type.id,
            value: type.name,
            score: null as string | null
          }))
        },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'fundSourceAccountId',
        label: 'Fund Source',
        value: values ? values.fundSourceAccountId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.assetAccountData.map((account: any) => ({
            id: account.id,
            value: `${account.name} (${account.glCode})`,
            score: null as string | null
          }))
        },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  getFeesIncomeFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'chargeId',
        label: 'Fees',
        value: values ? values.chargeId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.chargeData.map((charge: any) => ({
            id: charge.id,
            value: charge.amount ? `${charge.name} (${charge.currency?.name || ''} ${charge.amount})` : charge.name,
            score: null as string | null
          }))
        },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'incomeAccountId',
        label: 'Income Account',
        value: values ? values.incomeAccountId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.incomeAccountData.map((account: any) => ({
            id: account.id,
            value: `${account.name} (${account.glCode})`,
            score: null as string | null
          }))
        },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  getPenaltyIncomeFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'chargeId',
        label: 'Penalty',
        value: values ? values.chargeId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.penaltyData.map((penalty: any) => ({
            id: penalty.id,
            value: penalty.amount ? `${penalty.name} (${penalty.currency?.name || ''} ${penalty.amount})` : penalty.name,
            score: null as string | null
          }))
        },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'incomeAccountId',
        label: 'Income Account',
        value: values ? values.incomeAccountId : '',
        options: { 
          label: 'value', 
          value: 'id', 
          data: this.incomeAccountData.map((account: any) => ({
            id: account.id,
            value: `${account.name} (${account.glCode})`,
            score: null as string | null
          }))
        },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  get loanProductAccounting() {
    return this.loanProductAccountingForm.value;
  }

}
