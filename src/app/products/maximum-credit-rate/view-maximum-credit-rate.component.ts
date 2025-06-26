/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

/**
 * View Maximum Credit Rate component.
 */
@Component({
  selector: 'mifosx-view-maximum-credit-rate',
  templateUrl: './view-maximum-credit-rate.component.html',
  styleUrls: ['./view-maximum-credit-rate.component.scss']
})
export class ViewMaximumCreditRateComponent implements OnInit {

  /** Maximum Credit Rate Data. */
  maximumCreditRateData: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['productType', 'appliedOnDate', 'maxRate'];

  /** Paginator for tax component table. */
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    /** Sorter for tax component table. */
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  /**
   * Retrieves the Maximum Credit Rate data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { maximumCreditRate: any }) => {
      this.maximumCreditRateData = data.maximumCreditRate;
    });
  }

  setCustomFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => { // data is any
      const searchFilter = filter.trim().toLowerCase();

      const productTypeMatches = data.productType && data.productType.name // Typo here!
                                 && data.productType.name.toLowerCase().includes(searchFilter);

      // ... rest of predicate
      return productTypeMatches;
    };
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.maximumCreditRateData.rates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setCustomFilterPredicate();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
