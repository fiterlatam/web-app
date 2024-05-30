import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'mifosx-interest-rates',
  templateUrl: './interest-rates.component.html',
  styleUrls: ['./interest-rates.component.scss']
})
export class InterestRatesComponent implements OnInit {
  interestRatesData: any;
  displayedColumns: string[] = ['name', 'appliedOnDate', 'currentRate', 'active'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(( data: { interestRates: any } ) => {
      this.interestRatesData = data.interestRates;
    });
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.setInterestRates();
  }
  setInterestRates() {
   this.dataSource = new MatTableDataSource(this.interestRatesData);
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
  }
}
