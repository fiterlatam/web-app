import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DeleteCustomChargeTypeMapDialogComponent
} from '../delete-customchargetypemap-dialog/delete-customchargetypemap-dialog.component';
import {CustomChargeTypeMapService} from '../customchargetypemap.service';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-view-charge-map',
  templateUrl: './view-charge-map.component.html',
  styleUrls: ['./view-charge-map.component.scss']
})
export class ViewChargeMapComponent implements OnInit {

  chargeMapData: any;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private customChargeTypeMapService: CustomChargeTypeMapService) {
    this.route.data.subscribe((data: { chargeMap: any }) => {
      this.chargeMapData = data.chargeMap;
    });
  }

  ngOnInit() {
  }

  delete() {
    const data: any = {
      id: this.chargeMapData.id
    };
    const deleteSignatureDialogRef = this.dialog.open(DeleteCustomChargeTypeMapDialogComponent, {
      data
    });
    deleteSignatureDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.customChargeTypeMapService.deleteChargeMapEntity(this.chargeMapData.id)
          .subscribe(() => {
            this.router.navigate(['/products/customchargetypemap']).then(r => logger.info('Successfully deleted the charge map'));
          });
      }
    });
  }

}
