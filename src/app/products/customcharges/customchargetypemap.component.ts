import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';

import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

/** rxjs Imports */
import { DeleteCustomChargeTypeMapDialogComponent } from './delete-customchargetypemap-dialog/delete-customchargetypemap-dialog.component';
/** Charting Imports */
import Chart from 'chart.js';

/** Custom Services */
import { CustomChargeTypeMapService } from './customchargetypemap.service';

@Component({
  selector: 'mifosx-customchargetypemap',
  templateUrl: './customchargetypemap.component.html',
  styleUrls: ['./customchargetypemap.component.scss']
})

export class CustomChargeTypeMapComponent implements OnInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns =  ['term', 'percentage', 'validFrom', 'validTo', 'active'];
  name = new UntypedFormControl();
  reloaded = false;
  filterForm: UntypedFormGroup;
  customChargeEntityList: any[] = [];
  customChargeTypeList: any;
  customChargeEntityId: any;
  customChargeTypeId: any;
  chart: any;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private formBuilder: UntypedFormBuilder,
              private dialog: MatDialog,
              private customchargetypemapService: CustomChargeTypeMapService) {
    this.loadEntities();
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      'customChargeEntityId': [''],
      'customChargeTypeId': ['']
    });
  }
  loadEntities() {
    this.customchargetypemapService.getCustomChargeEntity().subscribe(( apiResponseBody: any ) => {
      this.customChargeEntityList = apiResponseBody;
      this.apiData = [];
    });
  }

  changeChargeEntityEvent(id: any) {
      this.customChargeEntityId = id;
      this.apiData = [];
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = this.apiData;
      this.customchargetypemapService.getCustomChargeType(id).subscribe(( apiResponseBody: any ) => {
      this.customChargeTypeList = apiResponseBody;
    });
  }

  changeChargeTypeEvent(id: any) {
    this.customChargeTypeId = id;
    this.loadClientallies(this.customChargeTypeId);
  }

  loadClientallies(customChargeTypeId: any) {
    this.reloaded = false;
    this.customchargetypemapService.getCustomChargeTypeMap(this.customChargeEntityId, customChargeTypeId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = apiResponseBody;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setChart(this.apiData);
      this.reloaded = true;
    });
    this.reloaded = true;
  }

  setChart(data: any) {
    interface CustomChargeTypeMapInterface {
      term: number;
      percentage: number;
    }
    const chartLabels: string[] = data.map((item: CustomChargeTypeMapInterface) => item.term);
    const chartValues: string[] = data.map((item: CustomChargeTypeMapInterface) => item.percentage);
    this.chart = new Chart('charge-line-chart', {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartValues
        }]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Curva del Cargo'
        },
        layout: {
          padding: {
            top: 10,
            bottom: 15
          }
        }
      }
    });
  }

}


