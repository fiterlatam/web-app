import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'mifosx-manage-blocking-reasons',
  templateUrl: './manage-blocking-reasons.component.html',
  styleUrls: ['./manage-blocking-reasons.component.scss']
})
export class ManageBlockingReasonsComponent implements OnInit {

  blockingReasonSettings: any;

  displayedColumns: string[] = ['id', 'priority', 'level', 'nameOfReason', 'description', 'createdDate'];

  dataSource: MatTableDataSource<any>;

  dataSourceDisabled: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  @ViewChild(MatPaginator, { static: true }) paginatorDisabled: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortDisabled: MatSort;



  constructor(private route: ActivatedRoute,
            private translateService: TranslateService) {
    this.route.data.subscribe((data: { manageBlockingReasonsResolver: any }) => {
      this.blockingReasonSettings = data.manageBlockingReasonsResolver;
    });
  }

  ngOnInit() {
    this.setBlockingReasonSettings();
  }

  setBlockingReasonSettings() {
    for (const blockingReasonSetting of this.blockingReasonSettings) {
      blockingReasonSetting.level = this.translateService.instant('labels.text.' + blockingReasonSetting?.level);
    }
    this.dataSource = new MatTableDataSource(this.blockingReasonSettings.filter((item: { isEnabled: boolean; }) => item.isEnabled));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceDisabled = new MatTableDataSource(this.blockingReasonSettings.filter((item: { isEnabled: boolean; }) => !item.isEnabled));
    this.dataSourceDisabled.paginator = this.paginatorDisabled;
    this.dataSourceDisabled.sort = this.sortDisabled;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.dataSourceDisabled.filter = filterValue.toLowerCase().trim();
  }
}
