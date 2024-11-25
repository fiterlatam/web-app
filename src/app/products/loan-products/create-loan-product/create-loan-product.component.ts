/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Components */
import { LoanProductDetailsStepComponent } from '../loan-product-stepper/loan-product-details-step/loan-product-details-step.component';
import { LoanProductCurrencyStepComponent } from '../loan-product-stepper/loan-product-currency-step/loan-product-currency-step.component';
import { LoanProductTermsStepComponent } from '../loan-product-stepper/loan-product-terms-step/loan-product-terms-step.component';
import { LoanProductSettingsStepComponent } from '../loan-product-stepper/loan-product-settings-step/loan-product-settings-step.component';
import { LoanProductChargesStepComponent } from '../loan-product-stepper/loan-product-charges-step/loan-product-charges-step.component';
import { LoanProductAccountingStepComponent } from '../loan-product-stepper/loan-product-accounting-step/loan-product-accounting-step.component';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { LoanProducts } from '../loan-products';
import { AdvancedPaymentAllocation, AdvancedPaymentStrategy, PaymentAllocation } from '../loan-product-stepper/loan-product-payment-strategy-step/payment-allocation-model';
import { SubChannelLoanProductInterface } from 'app/loans/models/loan-account.model';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-create-loan-product',
  templateUrl: './create-loan-product.component.html',
  styleUrls: ['./create-loan-product.component.scss']
})
export class CreateLoanProductComponent implements OnInit {

  @ViewChild(LoanProductDetailsStepComponent, { static: true }) loanProductDetailsStep: LoanProductDetailsStepComponent;
  @ViewChild(LoanProductCurrencyStepComponent, { static: true }) loanProductCurrencyStep: LoanProductCurrencyStepComponent;
  @ViewChild(LoanProductTermsStepComponent, { static: true }) loanProductTermsStep: LoanProductTermsStepComponent;
  @ViewChild(LoanProductSettingsStepComponent, { static: true }) loanProductSettingsStep: LoanProductSettingsStepComponent;
  @ViewChild(LoanProductChargesStepComponent, { static: true }) loanProductChargesStep: LoanProductChargesStepComponent;
  @ViewChild(LoanProductAccountingStepComponent, { static: true }) loanProductAccountingStep: LoanProductAccountingStepComponent;

  loanProductsTemplate: any;
  accountingRuleData = ['None', 'Cash', 'Accrual (periodic)', 'Accrual (upfront)'];
  itemsByDefault: any[] = [];

  isAdvancedPaymentStrategy = false;
  paymentAllocation: PaymentAllocation[] = [];
  creditAllocation: PaymentAllocation[] = [];
  advancedPaymentAllocations: AdvancedPaymentAllocation[] = [];
  advancedCreditAllocations: AdvancedPaymentAllocation[] = [];

  SubChannelInterfaceArray: SubChannelLoanProductInterface[] = [];

   /**
    * @param {ActivatedRoute} route Activated Route.
    * @param {ProductsService} productsService Product Service.
    * @param {LoanProducts} loanProducts LoanProducts
    * @param {Router} router Router for navigation.
    */
  constructor(private route: ActivatedRoute,
              private productsService: ProductsService,
              private loanProducts: LoanProducts,
              private router: Router,
              private advancedPaymentStrategy: AdvancedPaymentStrategy) {
    this.route.data.subscribe((data: { loanProductsTemplate: any, configurations: any }) => {
      this.loanProductsTemplate = data.loanProductsTemplate;
      const assetAccountData = this.loanProductsTemplate.accountingMappingOptions.assetAccountOptions || [];
      const liabilityAccountData = this.loanProductsTemplate.accountingMappingOptions.liabilityAccountOptions || [];
      this.loanProductsTemplate.accountingMappingOptions.assetAndLiabilityAccountOptions = assetAccountData.concat(liabilityAccountData);

      this.itemsByDefault = loanProducts.setItemsByDefault(data.configurations);
      this.loanProductsTemplate['itemsByDefault'] = this.itemsByDefault;
      this.loanProductsTemplate = loanProducts.updateLoanProductDefaults(this.loanProductsTemplate, false);
    });
  }

  ngOnInit() {
    this.buildAdvancedPaymentAllocation();
  }

  get loanProductDetailsForm() {
    return this.loanProductDetailsStep.loanProductDetailsForm;
  }

  get loanProductCurrencyForm() {
    if (this.loanProductCurrencyStep != null) {
      return this.loanProductCurrencyStep.loanProductCurrencyForm;
    }
  }

  get loanProductTermsForm() {
    return this.loanProductTermsStep.loanProductTermsForm;
  }

  advancePaymentStrategy(value: string) {
    this.isAdvancedPaymentStrategy = LoanProducts.isAdvancedPaymentAllocationStrategy(value);
  }

  buildAdvancedPaymentAllocation(): void {
    this.advancedPaymentAllocations = this.advancedPaymentStrategy.buildAdvancedPaymentAllocationList(this.loanProductsTemplate);
  }

  setPaymentAllocation(paymentAllocation: PaymentAllocation[]): void {
    this.paymentAllocation = paymentAllocation;
  }

  setCreditAllocation(paymentAllocation: PaymentAllocation[]): void {
    this.creditAllocation = paymentAllocation;
  }

  setSubChannelInterfaceArray(subChannelLoanProductInterface: SubChannelLoanProductInterface[]): void {
    this.SubChannelInterfaceArray = subChannelLoanProductInterface;
  }

  get loanProductSettingsForm() {
    return this.loanProductSettingsStep.loanProductSettingsForm;
  }

  get loanProductAccountingForm() {
    return this.loanProductAccountingStep.loanProductAccountingForm;
  }

  get loanProductFormValid() {
    return (
      this.loanProductDetailsForm.valid &&
      this.loanProductCurrencyForm.valid &&
      this.loanProductTermsForm.valid &&
      this.loanProductSettingsForm.valid &&
      this.loanProductAccountingForm.valid
    );
  }

  get loanProduct() {
    const loanProduct = {
      ...this.loanProductDetailsStep.loanProductDetails,
      ...this.loanProductCurrencyStep.loanProductCurrency,
      ...this.loanProductTermsStep.loanProductTerms,
      ...this.loanProductSettingsStep.loanProductSettings,
      ...this.loanProductChargesStep.loanProductCharges,
      ...this.loanProductAccountingStep.loanProductAccounting
    };
    if (this.isAdvancedPaymentStrategy) {
      loanProduct['paymentAllocation'] = this.paymentAllocation;
      loanProduct['creditAllocation'] = this.creditAllocation;
    }
    return loanProduct;
  }

  submit() {
    const channelOptions = this.loanProductsTemplate['channelOptions'];
    const loanProductSettings = this.loanProductSettingsStep.loanProductSettings;
    const repaymentChannels = loanProductSettings.repaymentChannels;
    let selectedRepaymentChannels = [];
    if (repaymentChannels && repaymentChannels.length > 0) {
      selectedRepaymentChannels = repaymentChannels
        .map((opt: any, i: number) => opt ? {id: channelOptions[i].id} : null)
        .filter((opt: any) => opt !== null);
    }
    const loanProduct = this.loanProducts.buildPayload(this.loanProduct, this.itemsByDefault);
    loanProduct['repaymentChannels'] = selectedRepaymentChannels;
    if (loanProduct['useDueForRepaymentsConfigurations'] === true) {
      loanProduct['dueDaysForRepaymentEvent'] = null;
      loanProduct['overDueDaysForRepaymentEvent'] = null;
    }
    delete loanProduct['useDueForRepaymentsConfigurations'];
    this.productsService.createLoanProduct(loanProduct)
      .subscribe((response: any) => {
        this.router.navigate(['../', response.resourceId], {relativeTo: this.route}).then(r => logger.info('Loan Product Created Successfully'));
      });
  }

}
