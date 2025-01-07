import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mifosx-collection-house-config',
  templateUrl: './collection-house-config.component.html',
  styleUrls: ['./collection-house-config.component.scss']
})
export class CollectionHouseConfigComponent implements OnInit {
  collectionHouse: any;
  displayedColumns: string[] = ['collectionName', 'collectionNit', 'collectionCode'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private route: ActivatedRoute,
    private router: Router) {
      this.route.data.subscribe((data: { collectionHouse: any }) => {
        this.collectionHouse = data?.collectionHouse;
      });
     }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.collectionHouse);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
