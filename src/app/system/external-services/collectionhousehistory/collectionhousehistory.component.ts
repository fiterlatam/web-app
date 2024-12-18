import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-collectionhousehistory',
  templateUrl: './collectionhousehistory.component.html',
  styleUrls: ['./collectionhousehistory.component.scss']
})
export class CollectionhousehistoryComponent implements OnInit {

  collectionHouseConfigurationData: any;

  displayedColumns: string[] = ['name', 'value'];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
/**
   * Retrieves the Collection House configuration data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { collectionHouseHistory: any }) => {
      this.collectionHouseConfigurationData = data?.collectionHouseHistory; 
    });
   }

  ngOnInit(): void {
    this.setCollectionHouseConfiguration();
  }

  setCollectionHouseConfiguration(){
    this.dataSource = new MatTableDataSource(this.collectionHouseConfigurationData);
    this.dataSource.sort = this.sort;     
  }

  getConfigurationValue(configuration: any): string {
    
    const value = configuration.value;
    if (configuration.name === 'collectionHouse_access_key' || configuration.name === 'collectionHouse_secret_key') {
      return value.replace(value.substr(1, value.length - 3), value.substr(1, value.length - 3).replace(/./g, '*'));
    }
    return value;
  }

}
