import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { ChannelService } from './channel.service';

@Component({
  selector: 'mifosx-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})

export class ChannelComponent implements OnInit, AfterViewInit {
  apiData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns =  ['name', 'channelType', 'description', 'active'];
  name = new UntypedFormControl();
  reloaded = false;

  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;
  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router,
              private channelService: ChannelService) {
    this.loadClientallies('');
  }

  ngOnInit(): void {
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
    this.channelService.getChannel(filterValue).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
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
}
