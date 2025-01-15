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
import { SubChannelService } from './subchannel.service';

@Component({
  selector: 'mifosx-subchannel',
  templateUrl: './subchannel.component.html',
  styleUrls: ['./subchannel.component.scss']
})

export class SubChannelComponent implements OnInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns =  ['name','description','active'];

  name = new UntypedFormControl();

  reloaded = false;

  parentId = this.route.snapshot.params["channelId"];


  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private SubChannelService: SubChannelService) {

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

  }


  loadClientallies(filterValue: String) {

    this.reloaded = false;

    console.log("loadClientallies " + filterValue);
    this.SubChannelService.getSubChannel(this.parentId, filterValue).subscribe(( apiResponseBody: any ) => {
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
        this.SubChannelService.deleteEntity(id)
          .subscribe(() => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          });
  }


  changeShowClosedGroups() {
  }
}
