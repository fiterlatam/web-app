/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { ClientsService } from 'app/clients/clients.service';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Block Client Component
 */
@Component({
  selector: 'mifosx-block-client',
  templateUrl: './block-client.component.html',
  styleUrls: ['./block-client.component.scss']
})
export class BlockClientComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Block Client form. */
  blockClientForm: UntypedFormGroup;
  /** Client Data */
  blockingData: any;
  /** Client Id */
  clientId: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ClientsService} clientsService Clients Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private clientsService: ClientsService,
              private dateUtils: Dates,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService) {
      this.route.data.subscribe((data: { clientActionData: any }) => {
        if (data.clientActionData.blockingReasonsDataOptions) {
          let blockingData = data.clientActionData.blockingReasonsDataOptions;
          blockingData.sort((a: { priority: number; }, b: { priority: number; }) => a.priority - b.priority);
          blockingData = blockingData.filter((item: { isEnabled: boolean; }) => item.isEnabled);
          this.blockingData = blockingData;
        }
    });
    this.clientId = this.route.parent.snapshot.params['clientId'];
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createBlockClientForm();
  }

  /**
   * Creates the block client form.
   */
  createBlockClientForm() {
    this.blockClientForm = this.formBuilder.group({
      'blockedOnDate': ['', Validators.required],
      'blockingReasonId': ['', Validators.required],
      'blockingComment': ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  /**
   * Submits the form and blocks the client.
   */
  submit() {
    const blockClientFormData = this.blockClientForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevBlockedDate: Date = this.blockClientForm.value.blockedOnDate;
    if (blockClientFormData.blockedOnDate instanceof Date) {
      blockClientFormData.blockedOnDate = this.dateUtils.formatDate(prevBlockedDate, dateFormat);
    }
    const data = {
      ...blockClientFormData,
      dateFormat,
      locale
    };
    this.clientsService.executeClientCommand(this.clientId, 'block', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }

}
