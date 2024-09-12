import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'mifosx-maximum-credit-rate-history',
  templateUrl: './maximum-credit-rate-history.component.html',
  styleUrls: ['./maximum-credit-rate-history.component.scss']
})
export class MaximumCreditRateHistoryComponent implements OnInit {
  totalFilteredRecords: number;
  creditRateHistoryData: any;
  displayedColumns: string[] = ['id', 'appliedOnDate', 'currentRate', 'dailyNominalRate', 'monthlyNominalRate', 'annualNominalRate', 'createdBy'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { creditRateHistory: any }) => {
      this.creditRateHistoryData = data.creditRateHistory;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.creditRateHistoryData);
    this.dataSource.paginator = this.paginator;
  }

}
