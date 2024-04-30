/** Angular Imports */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Delete signature dialog component.
 */
@Component({
  selector: 'mifosx-delete-customchargetypemap-dialog',
  templateUrl: './delete-customchargetypemap-dialog.component.html',
  styleUrls: ['./delete-customchargetypemap-dialog.component.scss']
})
export class DeleteCustomChargeTypeMapDialogComponent {

  /** Id of client signature in documents */
  signatureId: any;
  data: any = {};
  id: number;

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {any} data Documents data
   */
  constructor(public dialogRef: MatDialogRef<DeleteCustomChargeTypeMapDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public indata: any = {}) {
    this.data = indata;
    this.id = indata.id;
  }

}
