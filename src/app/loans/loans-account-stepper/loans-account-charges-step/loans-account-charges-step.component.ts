/** Angular Imports */
import { Component, ViewChild, ElementRef, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

/** Dialog Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { LoansAccountAddCollateralDialogComponent } from 'app/loans/custom-dialog/loans-account-add-collateral-dialog/loans-account-add-collateral-dialog.component';

/** Custom Services */
import { DatepickerBase } from 'app/shared/form-dialog/formfield/model/datepicker-base';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { principalAmountChangeEvent } from '../loans-account-terms-step/loans-account-terms-step.component'; // Importe o EventEmitter do ComponentB
import { MatSelect } from '@angular/material/select';
import { Charge } from 'app/shared/models/general.model';

/**
 * Recurring Deposit Account Charges Step
 */
@Component({
  selector: 'mifosx-loans-account-charges-step',
  templateUrl: './loans-account-charges-step.component.html',
  styleUrls: ['./loans-account-charges-step.component.scss']
})
export class LoansAccountChargesStepComponent implements OnInit, OnChanges {

  // @Input loansAccountProductTemplate: LoansAccountProductTemplate
  @Input() loansAccountProductTemplate: any;
  // @Imput loansAccountTemplate: LoansAccountTemplate
  @Input() loansAccountTemplate: any;
  // @Input() loansAccountFormValid: LoansAccountFormValid
  @Input() loansAccountFormValid: boolean;

  @ViewChild('charge') chargeSelect!: MatSelect;
  @ViewChild('addChargeButton') addChargeButton!: HTMLButtonElement;


  /** Charges Data */
  chargeData: any;
  /** Charges Data Source */
  chargesDataSource: {}[] = [];
  /** Overdue Charges Data Source */
  overDueChargesDataSource: {}[] = [];
  /** Collateral Data Source */
  collateralDataSource: {}[] = [];
  /** Charges table columns */
  chargesDisplayedColumns: string[] = ['name', 'chargeCalculationType', 'amount', 'chargeTimeType', 'date', 'action','endorsed'];
  /** Columns to be displayed in overdue charges table. */
  overdueChargesDisplayedColumns: string[] = ['name', 'type', 'amount', 'collectedon'];
  /** Component is pristine if there has been no changes by user interaction */
  pristine = true;
  /** Check if value of collateral added  is more than principal amount */
  isCollateralSufficient = false;
  /** Total value of all collateral added to a loan */
  totalCollateralValue: any = 0;
  loanId: any = null;
  /** Check if the product is Vehiculos */
  isVehiculos: boolean = false;
  /** Maximum date allowed. */
  maxDate = new Date(2100, 0, 1);

  /**
   * Loans Account Charges Form Step
   * @param {dialog} MatDialog Mat Dialog
   * @param {Dates} dateUtils Date Utils
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(public dialog: MatDialog,
    private dateUtils: Dates,
    private route: ActivatedRoute,
    private settingsService: SettingsService, private translate: TranslateService) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.maxDate = this.settingsService.maxFutureDate;
    if (this.loansAccountTemplate && this.loansAccountTemplate.charges) {
      if(this.loansAccountProductTemplate?.product?.productType?.name === "SU+ Vehiculos"){
        this.isVehiculos = true;
        this.chargesDisplayedColumns= ['name', 'chargeCalculationType', 'amount', 'chargeTimeType', 'action', 'endorsed'];
      }
      this.chargesDataSource = this.loansAccountTemplate.charges.map((charge: any) => ({ ...charge, id: charge.chargeId, expdate: charge?.expDate || null, isEndorsed: charge.amount === 0, insuranceName: charge?.insuranceName, insuranceId : charge?.insuranceId })) || [];
    }

    principalAmountChangeEvent.subscribe((newPrincipalAmountValue: any) => {

      // Delete all "Comision Mi Pyme" charge previously associated to this loan
      this.chargesDataSource = this.chargesDataSource.filter(
        (item: Charge) => !item.name?.toLowerCase().includes("comision mi pyme") && !item.name?.toLowerCase().includes("capital pendiente mi pyme")
      );


      // Filter charges by amount and associate them out
      if (this.loansAccountProductTemplate.loanProductName.toLowerCase().includes('microcredito')) {

        var amountLimit = this.loansAccountProductTemplate.smvl;
        let informationIndex = -1;

        let chargeRootName = "Capital Pendiente";

        if (this.loansAccountProductTemplate.loanProductName.toLowerCase() == 'microcredito' 
              || this.loansAccountProductTemplate.loanProductName.toLowerCase() == 'microcredito m' ) {
          chargeRootName = "Comision";
        }

        var filterCriteria = chargeRootName + " Mi Pyme >= 4SMLV";

        if(newPrincipalAmountValue.id < amountLimit) {
          filterCriteria = chargeRootName + " Mi Pyme < 4SMLV";
        }
        

        // Filter charges by name to correspond to the filterCriteria, depending on the amount.
        this.chargeData.forEach((item: Charge) => {

          informationIndex++;

          if(item.name?.toLowerCase().includes(filterCriteria.toLowerCase())) {

            const mappedItem = {
              chargeId:       this.chargeData[informationIndex].id,
              name:       this.chargeData[informationIndex].name,
              chargeTimeType:       this.chargeData[informationIndex].chargeTimeType,
              chargeCalculationType:       this.chargeData[informationIndex].chargeCalculationType,
              currency:       this.chargeData[informationIndex].currency,
              amount:       this.chargeData[informationIndex].amount,
              amountPaid: 0,
              amountWaived: 0,
              amountWrittenOff: 0,
              amountOutstanding:       this.chargeData[informationIndex].amount,
              penalty:       this.chargeData[informationIndex].penalty,
              chargePaymentMode:       this.chargeData[informationIndex].chargePaymentMode,
              paid: false,
              waived: false,
              chargePayable: false,
              id:       this.chargeData[informationIndex].id,
              isEndorsed: false,
              insuranceName:       this.chargeData[informationIndex].chargeInsuranceDetailData?.insuranceName || "",
              insuranceId:       this.chargeData[informationIndex].chargeInsuranceDetailData?.insuranceCode || ""
            };
      
            // Add charge to the chargesDataSource
            this.chargesDataSource = [...this.chargesDataSource, mappedItem];
          }
        });

      }

    });
  }

  /**
   * Executes on change of input values
   */
  ngOnChanges() {
    if (this.loansAccountProductTemplate) {
      this.chargeData = this.loansAccountProductTemplate.chargeOptions;
      if (this.loansAccountProductTemplate.overdueCharges) {
        this.overDueChargesDataSource = this.loansAccountProductTemplate.overdueCharges;
      }
      if (this.loansAccountProductTemplate.charges) {
        if(this.loansAccountProductTemplate?.product?.productType?.name === "SU+ Vehiculos"){
          this.isVehiculos = true;
        }
        if(this.loanId){
          console.log(this.loansAccountTemplate.charges)
          this.chargesDataSource = this.loansAccountTemplate.charges.map((charge: any) => ({ ...charge, id: charge.chargeId, expdate: charge?.expDate, isEndorsed: charge.amount === 0, insuranceName: charge?.insuranceName, insuranceId : charge?.insuranceId  })) || [];
        }else{
          console.log("non ",this.loansAccountTemplate.charges)
          this.chargesDataSource = this.loansAccountProductTemplate.charges.map((charge: any) => ({ ...charge, id: charge.chargeId, expdate: null, isEndorsed: charge.amount === 0, insuranceName: "", insuranceId : ""  })) || [];
        }

      }
    }
  }

  /**
   * Add a charge
   */
  addCharge(charge: any) {
    this.chargesDataSource = this.chargesDataSource.concat([charge.value]);
    charge.value = '';
    this.pristine = false;
  }

  /**
   * Edits the Charge Amount
   * @param {any} charge Charge
   */
  editChargeAmount(charge: any) {
    const tomorrow = new Date(Date.now() + 86400000);
    this.maxDate = this.settingsService.maxFutureDate;

    var formfields: FormfieldBase[];

    if(this.isVehiculos === true){
       formfields = [
        new InputBase(
          {
          controlName: 'amount',
          label: this.translate.instant('labels.inputs.Amount'),
          value: charge.amount,
          type: 'number',
          required: false
        }),
        new InputBase(
          {
          controlName: 'insuranceName',
          label: this.translate.instant('labels.inputs.insuranceName'),
          value: charge?.insuranceName,
          type: 'string',
          required: false
        }),
        new InputBase(
          {
          controlName: 'insuranceId',
          label: this.translate.instant('labels.inputs.insuranceID'),
          value: charge?.insuranceId,
          type: 'string',
          required: false
        }),
        new DatepickerBase({
          controlName: 'expdate',
          label: this.translate.instant('labels.inputs.expdate'),
          value: charge?.expDate || null,
          type: 'date',
          required: true,
          maxDate: this.maxDate,
          minDate: tomorrow
        })
      ];
    }else{
     formfields = [
      new InputBase({
        controlName: 'amount',
        label: 'Amount',
        value: charge.amount,
        type: 'number',
        required: false
      }),
    ];
  }
    const data = {
      title: 'Edit Charge Amount',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editNoteDialogRef = this.dialog.open(FormDialogComponent, { data });
    editNoteDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        var newCharge: any;
        if (this.isVehiculos === true) {
          var isEndorsed = false;
          if (response.data.value.amount == 0) {
            isEndorsed = true;
          }
          let expdate = this.dateUtils.formatDate(response.data.value.expdate, "yyyy-MM-dd");
          newCharge = {
            ...charge,
            amount: response.data.value.amount,
            expdate: expdate,
            isEndorsed: isEndorsed,
            insuranceName: response.data.value.insuranceName,
            insuranceId : response.data.value.insuranceId,
          };
        } else {
          newCharge = { ...charge, amount: response.data.value.amount };
        }
        this.chargesDataSource.splice(this.chargesDataSource.indexOf(charge), 1, newCharge);
        this.chargesDataSource = this.chargesDataSource.concat([]);
      }
    });
    this.pristine = true;
  }

  /**
   * Edits the Charge Date
   * @param {any} charge Charge
   */
  editChargeDate(charge: any) {
    const formfields: FormfieldBase[] = [
      new DatepickerBase({
        controlName: 'date',
        label: 'Date',
        value: charge.dueDate || charge.feeOnMonthDay || '',
        type: 'datetime-local',
        required: false
      }),
    ];
    const data = {
      title: 'Edit Charge Date',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editNoteDialogRef = this.dialog.open(FormDialogComponent, { data });
    editNoteDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        let newCharge: any;
        const dateFormat = this.settingsService.dateFormat;
        const date = this.dateUtils.formatDate(response.data.value.date, dateFormat);
        switch (charge.chargeTimeType.value) {
          case 'Specified due date':
          case 'Weekly Fee':
            newCharge = { ...charge, dueDate: date };
            break;
          case 'Annual Fee':
            newCharge = { ...charge, feeOnMonthDay: date };
            break;
        }
        this.chargesDataSource.splice(this.chargesDataSource.indexOf(charge), 1, newCharge);
        this.chargesDataSource = this.chargesDataSource.concat([]);
      }
    });
    this.pristine = false;
  }

  /**
   * Edits the Charge Fee Interval
   * @param {any} charge Charge
   */
  editChargeFeeInterval(charge: any) {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'feeInterval',
        label: 'Fee Interval',
        value: charge.feeInterval,
        type: 'text',
        required: false
      }),
    ];
    const data = {
      title: 'Edit Charge Fee Interval',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editNoteDialogRef = this.dialog.open(FormDialogComponent, { data });
    editNoteDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const newCharge = { ...charge, feeInterval: response.data.value.feeInterval };
        this.chargesDataSource.splice(this.chargesDataSource.indexOf(charge), 1, newCharge);
        this.chargesDataSource = this.chargesDataSource.concat([]);
      }
    });
    this.pristine = false;
  }

  /**
   * Delete a particular charge
   * @param charge Charge
   */
  deleteCharge(charge: any) {
    const deleteChargeDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `charge ${charge.name}` }
    });
    deleteChargeDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.chargesDataSource.splice(this.chargesDataSource.indexOf(charge), 1);
        this.chargesDataSource = this.chargesDataSource.concat([]);
        this.pristine = false;
      }
    });
  }


  /**
   * Returns Loans Account Charges and Collateral Form
   */
  get loansAccountCharges(): { charges: any[] } {

    return {
      charges: this.chargesDataSource,
    };
  }

}
