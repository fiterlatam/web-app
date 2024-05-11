import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
export class ManageBlockingReasonsComponent implements OnInit, AfterViewInit  {

  blockingReasonSettings: any;

  displayedColumns: string[] = ['id', 'priority', 'level', 'nameOfReason', 'description', 'createdDate'];

  dataSource: MatTableDataSource<any>;

  dataSourceDisabled: MatTableDataSource<any>;

  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;

  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort;
    this.dataSourceDisabled = new MatTableDataSource(this.blockingReasonSettings.filter((item: { isEnabled: boolean; }) => !item.isEnabled));
    this.dataSourceDisabled.paginator = this.paginator2;
    this.dataSourceDisabled.sort = this.sortDisabled;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.dataSourceDisabled.filter = filterValue.toLowerCase().trim();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator1;
    this.dataSourceDisabled.paginator = this.paginator2;
  }
}
