import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { SystemService } from '../../system.service';
import { DisableDialogComponent } from 'app/shared/disable-dialog/disable-dialog.component';
import { EnableDialogComponent } from 'app/shared/enable-dialog/enable-dialog.component';

@Component({
  selector: 'mifosx-view-manage-blocking-reasons',
  templateUrl: './view-manage-blocking-reasons.component.html',
  styleUrls: ['./view-manage-blocking-reasons.component.scss']
})
export class ViewManageBlockingReasonsComponent implements OnInit {

  viewBlockingReasonItemData: any;

 
  constructor(private route: ActivatedRoute,
              private systemService: SystemService,
              private router: Router,
              private dialog: MatDialog) {
    this.route.data.subscribe((data: { viewBlockingReasonItem: any }) => {
      this.viewBlockingReasonItemData = data.viewBlockingReasonItem;
    });
  }

  ngOnInit() {
  }

  openDialog() {
    if(this.viewBlockingReasonItemData.isEnabled){
      this.openDisableDialog();
    }else {
      this.openEnableDialog();
    }
  }

  openDisableDialog() {
    const disableReasonDialog = this.dialog.open(DisableDialogComponent, {
      data: { disableContext: this.viewBlockingReasonItemData.description} }
    );

    disableReasonDialog.afterClosed().subscribe((response: any) => {
      if (response.disable) {
        this.systemService.updateBlockReasonSetting(this.viewBlockingReasonItemData.id,"disable" ,null)
          .subscribe(() => {
            this.router.navigate(['/system/manage-blocking-reasons']);
          });
      }
    });
  }

  openEnableDialog() {
    const enableReasonDialog = this.dialog.open(EnableDialogComponent, {
      data: { enableContext: this.viewBlockingReasonItemData.description} }
    );

    enableReasonDialog.afterClosed().subscribe((response: any) => {
      if (response.enable) {
        this.systemService.updateBlockReasonSetting(this.viewBlockingReasonItemData.id,"enable",null)
          .subscribe(() => {
            this.router.navigate(['/system/manage-blocking-reasons']);
          });
      }
    });
  }

}
