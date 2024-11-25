import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ProductsService} from '../../products.service';
@Component({
  selector: 'mifosx-interest-rate-history',
  templateUrl: './interest-rate-history.component.html',
  styleUrls: ['./interest-rate-history.component.scss']
})
export class InterestRateHistoryComponent implements OnInit {
  totalFilteredRecords: number;
  interestRateHistoryData: any;
  displayedColumns: string[] = ['id', 'name', 'appliedOnDate', 'currentRate', 'interestRateType', 'active', 'createdBy'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { interestRateHistory: any }) => {
      this.interestRateHistoryData = data.interestRateHistory.pageItems;
      this.totalFilteredRecords = data.interestRateHistory.totalFilteredRecords;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.interestRateHistoryData);
    this.dataSource.paginator = this.paginator;
  }



}
