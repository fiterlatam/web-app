/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

/**
 * Amazon S3 Component.
 */
@Component({
  selector: 'mifosx-customchargehonorario',
  templateUrl: './customchargehonorario.component.html',
  styleUrls: ['./customchargehonorario.component.scss']
})
export class CustomChargeHonorarioComponent implements OnInit {

  /** Amazon S3 configuration data. */
  amazonS3ConfigurationData: any;
  /** Columns to be displayed in Amazon S3 configuration table. */
  displayedColumns: string[] = ['name', 'value'];
  /** Data source for Amazon S3 configuration table. */
  dataSource: MatTableDataSource<any>;

  /** Sorter for Amazon S3 configuration table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Retrieves the Amazon S3 configuration data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { customChargeHonorarioConfiguration: any }) => {
      this.amazonS3ConfigurationData = data.customChargeHonorarioConfiguration;
      console.log(data);      
    });
  }

  /**
   * Sets the Amazon S3 Configuration table.
   */
  ngOnInit() {
    this.setAmazonS3Configuration();
  }

  /**
   * Initializes the data source and sorter for Amazon S3 configuration table.
   */
  setAmazonS3Configuration() {
    this.dataSource = new MatTableDataSource(this.amazonS3ConfigurationData);
    this.dataSource.sort = this.sort;     
    /*
    this.route.data.subscribe((data: { customChargeHonorarioConfiguration: any }) => {
      this.amazonS3ConfigurationData = data.customChargeHonorarioConfiguration;
      console.log("data");      
      console.log(data);      
      console.log(data[1]);      
    });
    */
  }

  getConfigurationValue(configuration: any): string {
    console.log(configuration);
    const value = configuration.value;
    if (configuration.name === 's3_access_key' || configuration.name === 's3_secret_key') {
      return value.replace(value.substr(1, value.length - 3), value.substr(1, value.length - 3).replace(/./g, '*'));
    }
    return value;
  }

}
