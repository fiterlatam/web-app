/** Angular Imports */
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {SettingsService} from '../../../settings/settings.service';

/**
 * Create Loans Account Preview Step
 */
@Component({
  selector: 'mifosx-loans-account-preview-step',
  templateUrl: './loans-account-preview-step.component.html',
  styleUrls: ['./loans-account-preview-step.component.scss']
})
export class LoansAccountPreviewStepComponent implements OnInit {

  /** Loans Account Template */
  @Input() loansAccountTemplate: any = [];
  /** Loans Account Product Template */
  @Input() loansAccountProductTemplate: any;
  /** Loans Account Data */
  @Input() loansAccount: any;
  /** Submit Loans Account */
  @Output() submit = new EventEmitter();

  /** Charges Displayed Columns */
  chargesDisplayedColumns: string[] = ['name', 'chargeCalculationType', 'amount', 'chargeTimeType', 'date'];
  /** Overdue Charges Displayed Columns */
  overdueChargesDisplayedColumns: string[] = ['name', 'type', 'amount', 'collectedon'];
  locale: string;
  format: string;
  decimalPlace: string;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.locale = this.settingsService.language.code;
    this.decimalPlace = this.settingsService.decimals;
    this.format = `1.${this.decimalPlace}-${ this.decimalPlace}`;
  }

}
