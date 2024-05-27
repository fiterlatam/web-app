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
import { ChannelService } from './channel.service';

@Component({
  selector: 'mifosx-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})

export class ChannelComponent implements OnInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns =  ['name','description','nrSubChannels','active'];

  name = new UntypedFormControl();

  reloaded = false;


  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ChannelService: ChannelService) {

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
    this.ChannelService.getChannel(filterValue).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.log(apiResponseBody);
      console.log(this.apiData);
      this.dataSource = new MatTableDataSource(this.apiData);
      this.dataSource.data = apiResponseBody;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.reloaded = true;

    });  

    this.reloaded = true;
  }

  
  deleteEntity(channelId: any) {
    event.stopPropagation();

    this.router.navigate(['system/manage-system-channels/' + channelId + '/subchannel']);
  }


  changeShowClosedGroups() {
    console.log("changeShowClosedGroups ");
  }  
}
