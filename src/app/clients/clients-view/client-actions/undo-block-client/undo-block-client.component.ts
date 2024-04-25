/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { ClientsService } from 'app/clients/clients.service';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Undo Block Client Component
 */
@Component({
  selector: 'mifosx-undo-block-client',
  templateUrl: './undo-block-client.component.html',
  styleUrls: ['./undo-block-client.component.scss']
})
export class UndoBlockClientComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Undo Block Client form. */
  undoBlockClientForm: UntypedFormGroup;
  /** Client Data */
  undoBlockingData: any;
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
      this.route.data.subscribe((data: {
        clientViewData: any,
        clientActionData: any }) => {
        this.undoBlockingData = data.clientViewData;
        this.minDate = new Date(this.undoBlockingData.blockedOnDate);
    });
    this.clientId = this.route.parent.snapshot.params['clientId'];
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createUndoBlockClientForm();
  }

  /**
   * Creates the block client form.
   */
  createUndoBlockClientForm() {
    this.undoBlockClientForm = this.formBuilder.group({
      'undoBlockedOnDate': ['', Validators.required],
      'undoBlockingComment': ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  /**
   * Submits the form and unblocks the client.
   */
  submit() {
    const undoBlockClientFormData = this.undoBlockClientForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevUndoBlockedDate: Date = this.undoBlockClientForm.value.undoBlockedOnDate;
    if (undoBlockClientFormData.undoBlockedOnDate instanceof Date) {
      undoBlockClientFormData.undoBlockedOnDate = this.dateUtils.formatDate(prevUndoBlockedDate, dateFormat);
    }
    const data = {
      ...undoBlockClientFormData,
      dateFormat,
      locale
    };
    this.clientsService.executeClientCommand(this.clientId, 'undoBlock', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }

}
