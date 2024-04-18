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


   blockReasonSettingsData: any;

   displayedColumns: string[] = ['accountType'];

   dataSource: MatTableDataSource<any>;


   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

   @ViewChild(MatSort, { static: true }) sort: MatSort;


   constructor(private route: ActivatedRoute) {
     this.route.data.subscribe((data: { blockReasonSettings: any }) => {
       this.blockReasonSettingsData = data.blockReasonSettings;
     });
   }

   ngOnInit() {
     this.setBlockingReasonSettings();
   }

   setBlockingReasonSettings() {
     this.dataSource = new MatTableDataSource(this.blockReasonSettingsData);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sortingDataAccessor = (blockReasonSettings: any, property: any) => {
       return blockReasonSettings.accountType.value;
     };
     this.dataSource.sort = this.sort;
     this.dataSource.filterPredicate = (data: any, filter: string) => data.accountType.value.toLowerCase().indexOf(filter) !== -1;
   }

   applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.toLowerCase().trim();
   }

}
