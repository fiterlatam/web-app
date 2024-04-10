import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime} from 'rxjs/operators';

/** Custom Services */
import { ClientAllyPointOfSalesService } from './clientallypointofsales.service';

@Component({
  selector: 'mifosx-clientallypointofsales',
  templateUrl: './clientallypointofsales.component.html',
  styleUrls: ['./clientallypointofsales.component.scss']
})

export class ClientAllyPointOfSalesComponent implements OnInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns =  ['name', 'code','departmentCodeValueDescription', 'cityCodeValueDescription', 'brandCodeValueDescription', 'stateCodeValueDescription'];

  name = new UntypedFormControl();

  reloaded = false;

  parentId = "1";

  parentDescriptionAsTitle = "";

  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ClientAllyPointOfSalesService: ClientAllyPointOfSalesService) {
  }


  ngOnInit(): void {
    this.parentId = this.route.snapshot.params["parentId"];

    this.getDefaultValuesFromParent();
    this.loadClientallies("");
  }


  ngAfterViewInit() {
    this.name.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.loadClientallies(filterValue);
        })
      )
      .subscribe();
  }


  loadClientallies(filterValue: String) {
    this.reloaded = false;

    console.log("loadClientallies " + filterValue);
    this.ClientAllyPointOfSalesService.getClientAllyPointOfSales(this.parentId, filterValue).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.clear();
      console.log(apiResponseBody);
      console.log(this.apiData);
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = apiResponseBody;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.instructionTableRef.renderRows();

      this.reloaded = true;

    });  

    this.reloaded = true;
  }

  
  deleteEntity(event: any) {
        alert('222');

        event.stopPropagation();
  }


  changeShowClosedGroups() {
    console.log("changeShowClosedGroups ");
  }  


  getDefaultValuesFromParent() {
    this.ClientAllyPointOfSalesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;

      this.parentDescriptionAsTitle = this.apiData.companyName + " - NIT: " + this.apiData.nit;
 
    });      
  }

}
