/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Deactivate User Dialog component.
 */
@Component({
  selector: 'mifosx-deactivate-user-dialog',
  templateUrl: './deactivate-user-dialog.component.html',
  styleUrls: ['./deactivate-user-dialog.component.scss']
})
export class DeactivateUserDialogComponent implements OnInit {

  /** Deactivate user Form */
  deactivateUserForm: any;
  maxDate = new Date(2100, 0, 1);
  minDate = new Date();

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {any} data Provides any data.
   * @param formBuilder
   */
  constructor(public dialogRef: MatDialogRef<DeactivateUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.createDeactivateUserForm();
  }

  /** Deactivate user form */
  createDeactivateUserForm() {
    this.deactivateUserForm = this.formBuilder.group({
      'deactivatedFromDate': [''],
      'deactivatedToDate': [''],
      'temporaryDeactivation': [false],
    });
  }
}
