import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { SystemService } from '../../system.service';

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

  delete() {
    console.log('delete is executed !!!');
  }

}
