import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-gac',
  templateUrl: './gac.component.html',
  styleUrls: ['./gac.component.scss']
})
export class GacComponent implements OnInit {
  gacsData: any;
  displayedColumns: string[] = ['classification', 'minimumAgeDays', 'maximumAgeDays', 'blockingReasonName', 'percentageValue'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(( data: { gacs: any } ) => {
      this.gacsData = data.gacs;
    });
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.setGacs();
  }
  setGacs() {
   this.dataSource = new MatTableDataSource(this.gacsData);
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
  }
}
