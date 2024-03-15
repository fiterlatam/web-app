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
import { ClientsalliesService } from './clientsallies.service';

@Component({
  selector: 'mifosx-clientsallies',
  templateUrl: './clientsallies.component.html',
  styleUrls: ['./clientsallies.component.scss']
})

export class ClientsalliesComponent implements OnInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns =  ['companyName', 'nit', 'departmentCodeValueDescription', 'cityCodeValueDescription', 'nrPointOfSell', 'stateCodeValueDescription'];

  name = new UntypedFormControl();

  reloaded = false;


  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientsalliesService: ClientsalliesService) {

    this.loadClientallies("");
  }


  ngOnInit(): void {
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

    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }


  loadClientallies(filterValue: String) {

    this.reloaded = false;

    console.log("loadClientallies " + filterValue);
    this.clientsalliesService.getClientsallies(filterValue).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
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

  
  deleteEntity(id: any) {
        alert('111');
        this.clientsalliesService.deleteEntity(id)
          .subscribe(() => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          });
  }


  changeShowClosedGroups() {
    console.log("changeShowClosedGroups ");
  }  

  /*
  getStandingInstructions() {
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    const searchData = {
      clientId : this.standingIntructionsTemplateData.fromClient.id || this.fromClientId.value,
      clientName: this.standingIntructionsTemplateData.fromClient.displayName || this.clientNameControl.value,
      locale,
      dateFormat,
      limit: 14,
      offset: 0,
      fromAccountType: this.accountTypeId,
      fromAccountId: this.fromAccountId.value,
      fromTransferType: this.transferType.value
    };
    this.accountTransfersService.getStandingInstructions(searchData).subscribe((response: any) => {
      this.instructionsData = response.pageItems;
      this.dataSource.data = this.instructionsData;
      this.instructionTableRef.renderRows();
    });
  }  
  */


}
