import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'mifosx-view-loan-product-parameterization-list',
  templateUrl: './view-loan-product-parameterization-list.component.html',
  styleUrls: ['./view-loan-product-parameterization-list.component.scss']
})
export class ViewLoanProductParameterizationListComponent implements OnInit {
  loanProductParameterizationList: any;
  displayedColumns: string[] = [
    'invoicePrefix',
    'productType',
    'billingResolutionNumber',
    'generationDate',
    'expirationDate',
    'rangeFrom',
    'rangeTo',
    'lastInvoiceUsed',
    'lastCreditNote',
    'lastDebitNote'
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { loanProductParameterizationList: any }) => {
      this.loanProductParameterizationList = data.loanProductParameterizationList;
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.loanProductParameterizationList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
