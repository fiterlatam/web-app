/** Angular Imports */
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Reports component.
 */
@Component({
  selector: 'mifosx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  /** Reports data. */
  reportsData: any;
  /** Report category filter. */
  filter: string;
  /** Columns to be displayed in reports table. */
  displayedColumns: string[] = ['reportName', 'reportType', 'reportCategory'];
  /** Data source for reports table. */
  dataSource = new MatTableDataSource();

  /** Paginator for reports table. */
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  /** Sorter for reports table. */
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   * Retrieves the reports data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * Prevents reuse of route parameter `filter`.
   * @param {Router} router: Router.
   */
  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.data.subscribe((data: { reports: any }) => {
      this.reportsData = data.reports;
    });
    this.filter = this.route.snapshot.params['filter'];
  }

  /*
   *Sets and filters the reports table by category.
   */
  ngOnInit() {
    this.setReports();
    this.filterReportsByCategory();
  }

  /**
   * Switches filterPredicate if filterValue is not null.
   * @param {string} filterValue filter string for mat-table.
   */
  applyFilter(filterValue: string) {
    if (filterValue.length) {
      this.setCustomFilterPredicate();
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.filterReportsByCategory();
    }
  }

  /**
   * Initializes the data source, paginator and sorter for reports table.
   */
  setReports() {
    this.dataSource = new MatTableDataSource(this.reportsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Filters the data source only for report category passed in route params.
   */
  filterReportsByCategory() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.reportCategory === filter;
    };
    this.dataSource.filter = this.filter;
  }

  /**
   *  Filters Reports for filter value string and report category.
   */
  setCustomFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Convert the filter input to lowercase and trim spaces
      const transformedFilter = filter.trim().toLowerCase();

      // Extract the name and description, and make them lowercase
      const name = data.reportName.toLowerCase();
      const description = data.description ? data.description.toLowerCase() : '';

      // Create a regex to match at the start of any word in both name and description
      const regex = new RegExp(`\\b${transformedFilter}`, 'i');

      /* Seperates filter for All reports page and checks either report name or description contains the filter */
      if (this.filter) {
        return regex.test(name) && data.reportCategory === this.filter;
      } else {
        return regex.test(name);
      }
    };
  }


}
