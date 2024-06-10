import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/** rxjs Imports */
import { tap, distinctUntilChanged, debounceTime} from 'rxjs/operators';

/** Custom Services */
import { ClientAllyPointOfSalesService } from './clientallypointofsales.service';

@Component({
  selector: 'mifosx-clientallypointofsales',
  templateUrl: './clientallypointofsales.component.html',
  styleUrls: ['./clientallypointofsales.component.scss']
})

export class ClientAllyPointOfSalesComponent implements OnInit, AfterViewInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns =  ['name', 'code', 'departmentCodeValueDescription', 'cityCodeValueDescription', 'brandCodeValueDescription', 'stateCodeValueDescription'];
  name = new UntypedFormControl();
  reloaded = false;
  parentId = '1';
  parentDescriptionAsTitle = '';

  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private clientAllyPointOfSalesService: ClientAllyPointOfSalesService) {
  }


  ngOnInit(): void {
    this.parentId = this.route.snapshot.params['parentId'];
    this.getDefaultValuesFromParent();
    this.loadClientallies('');
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
    this.clientAllyPointOfSalesService.getClientAllyPointOfSales(this.parentId, filterValue).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = apiResponseBody;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.instructionTableRef) {
        this.instructionTableRef.renderRows();
      }
      this.reloaded = true;
    });
    this.reloaded = true;
  }


  deleteEntity(event: any) {
        alert('222');
        event.stopPropagation();
  }
  getDefaultValuesFromParent() {
    this.clientAllyPointOfSalesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.parentDescriptionAsTitle = this.apiData.companyName + ' - NIT: ' + this.apiData.nit;

    });
  }

}
