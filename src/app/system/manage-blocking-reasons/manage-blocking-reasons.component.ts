import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-manage-blocking-reasons',
  templateUrl: './manage-blocking-reasons.component.html',
  styleUrls: ['./manage-blocking-reasons.component.scss']
})
export class ManageBlockingReasonsComponent implements OnInit {

  blockingReasonSettings: any;

  displayedColumns: string[] = ['id','priority','level','customerLevel','creditLevel','nameOfReason','description','createdDate'];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { manageBlockingReasonsResolver: any }) => {
      this.blockingReasonSettings = data.manageBlockingReasonsResolver;
    });
  }

  ngOnInit() {
    this.setBlockingReasonSettings();
  }

  setBlockingReasonSettings() {
    this.dataSource = new MatTableDataSource(this.blockingReasonSettings);
    this.dataSource.paginator = this.paginator;    
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
  }
}