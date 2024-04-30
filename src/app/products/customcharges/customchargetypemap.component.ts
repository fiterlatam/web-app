import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, FormGroup, FormBuilder, Validators } from '@angular/forms';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime} from 'rxjs/operators';

import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

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

  // displayedColumns =  ['id','customChargeTypeId','term','percentage','validFrom','validTo','active','createdBy','createdAt','updatedBy','updatedAt'];
  displayedColumns =  ['term','percentage','validFrom','validTo','active', 'actions'];

  name = new UntypedFormControl();

  reloaded = false;

  filterForm: UntypedFormGroup;

  customChargeEntityList : any;
  customChargeTypeList : any;

  customChargeEntityId: any;
  customChargeTypeId: any;

  todayDate = new Date();

  chart: any;

//  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: UntypedFormBuilder,
              private dateUtils: Dates,              
              private dialog: MatDialog,
              private settingsService: SettingsService,
              private customchargetypemapService: CustomChargeTypeMapService) {

    //, Validators.pattern('')
    this.filterForm = this.formBuilder.group({
      'id': ['0'],
      'customChargeEntityid': [''],
      'customChargeTypeid': [''],
      'term': [''],
      'percentage': [''],
      'validFrom': [new Date()],
    });

    this.loadEntities();
  }


  patchValues() {
    this.filterForm.patchValue({
      'id': ['0'],      
      'term': [''],
      'percentage': [''],
      'validFrom': new Date(),
      });
  }    

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.changeChargeEntityEvent(this.customChargeEntityList[0].id);
  }
  
  deleteEntityModal(id: any) {
    let data: any = {};
    data.id = id;
    data.customChargeEntityId = this.customChargeEntityId;
    data.customChargeTypeId = this.customChargeTypeId;

    event.stopPropagation();

    const deleteSignatureDialogRef = this.dialog.open(DeleteCustomChargeTypeMapDialogComponent, {
      data
    });    



    deleteSignatureDialogRef.afterClosed().subscribe((response: any) => {
      if(response.delete) {
        this.customchargetypemapService.deleteEntity(this.customChargeEntityId, this.customChargeTypeId, id)
        .subscribe(() => {
          //this.router.navigate(['../../'], { relativeTo: this.route });
          this.loadClientallies(this.customChargeTypeId);
        });

        event.stopPropagation();
      }
    });    
  }


  changeShowClosedGroups() {
    console.log("changeShowClosedGroups ");
  }  

  loadEntities() {
    console.log("loadEntities");

    this.customchargetypemapService.getCustomChargeEntity().subscribe(( apiResponseBody: any ) => {
      this.customChargeEntityList = apiResponseBody;
      this.apiData = [];

      this.patchValues();
    });  
  }

  changeChargeEntityEvent(id: any) {
    console.log("OK! changeChargeEntityEvent id:" + id);

    console.log("changeChargeEntityEvent");

    this.customChargeEntityId = id;

    this.apiData = [];
    this.dataSource = new MatTableDataSource(this.apiData);
    this.dataSource.data = this.apiData;

    this.customchargetypemapService.getCustomChargeType(id).subscribe(( apiResponseBody: any ) => {
      this.customChargeTypeList = apiResponseBody;
      console.log(apiResponseBody);
      console.log(this.apiData);

//      this.customChargeTypeId = this.customChargeTypeList[0].id;

      this.patchValues();
    }); 
  }

  changeChargeTypeEvent(id: any) {
    console.log("OK! changeChargeEntityEvent id:" + id);

    console.log("changeChargeEntityEvent");

    this.customChargeTypeId = id;

    this.loadClientallies(this.customChargeTypeId);
  }


  loadClientallies(customChargeTypeId: any) {

    this.reloaded = false;

    console.log("loadClientallies " + customChargeTypeId);
    this.customchargetypemapService.getCustomChargeTypeMap(this.customChargeEntityId, customChargeTypeId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.log(apiResponseBody);
      console.log(this.apiData);
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = apiResponseBody;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

//      this.instructionTableRef.renderRows();

      this.setChart(this.apiData);

      this.reloaded = true;

    });  

    this.reloaded = true;
  }

  submit() {
//    this.filterForm.removeControl('customChargeEntityId');

    const groupFormData: any = {};

    groupFormData.term = this.filterForm.get("term").value;
    groupFormData.percentage = this.filterForm.get("percentage").value;
    groupFormData.validFrom = this.filterForm.get("validFrom").value;

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;

    groupFormData.validFrom = this.dateUtils.formatDate(groupFormData.validFrom, this.settingsService.dateFormat);

    const data = {
      ...groupFormData,
      dateFormat,
      locale
    };

    console.log(data);

    var id = this.filterForm.get("id").value;

    if(id > 0) {
      
      this.customchargetypemapService.editCustomChargeTypeMap(data, this.customChargeEntityId, this.customChargeTypeId, id).subscribe((response: any) => {
        this.patchValues();
        this.loadClientallies(this.customChargeTypeId);
      });    
    } else {
      this.customchargetypemapService.createCustomChargeTypeMap(data, this.customChargeEntityId, this.customChargeTypeId).subscribe((response: any) => {
        this.patchValues();
        this.loadClientallies(this.customChargeTypeId);
      });    
    }
  }

  fillValuesToEditCustomCharge(id: any, term: number, percentage: any, validFrom: any) {

    let dt = new Date(validFrom[0], validFrom[1]-1, validFrom[2]);

//    validFrom = this.dateUtils.formatDate(validFrom, 'dd/MM/yyyy');

    this.filterForm.patchValue({
      'id': id,
      'term': term,
      'percentage': percentage,
      'validFrom': new Date(),
      });

//    this.filterForm.get('validFrom').setValue(validFrom);

    event.preventDefault();
    event.stopPropagation();

    return;
  }


   
  setChart(data: any) {

    interface CustomChargeTypeMapInterface {
      term: number; 
      percentage: number;
    }

    let chartLabels: string[] = data.map((item: CustomChargeTypeMapInterface) => item.term);
    let chartValues: string[] = data.map((item: CustomChargeTypeMapInterface) => item.percentage);


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
          text: 'Curva do Cargo'
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


