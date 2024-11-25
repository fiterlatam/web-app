/** Angular Imports. */
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

/** Custom Services */
import {environment} from 'environments/environment';
import {ClientsService} from './clients.service';
import {BlockingReasonDialogComponent} from 'app/shared/blocking-reason-dialog/blocking-reason-dialog.component';

@Component({
  selector: 'mifosx-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  @ViewChild('showClosedAccounts') showClosedAccounts: MatCheckbox;

  displayedColumns = ['displayName', 'clientType', 'cedularOrNit', 'accountNumber', 'externalId', 'status', 'officeName'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  existsClientsToFilter = false;
  notExistsClientsToFilter = false;

  totalRows: number;
  isLoading = false;

  pageSize = 50;
  currentPage = 0;
  filterText = '';

  sortAttribute = '';
  sortDirection = '';

  showClosedAccountsChecked = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientsService, public dialog: MatDialog) {
  }

  ngOnInit() {
    if (environment.preloadClients) {
      this.getClients();
    }
  }

  /**
   * Searches server for query and resource.
   */
  search(value: string) {
    this.filterText = value;
    this.resetPaginator();
    this.getClients();
  }

  private getClients() {
    this.isLoading = true;
    this.clientService.searchByText(this.filterText, this.currentPage, this.pageSize, this.sortAttribute, this.sortDirection)
      .subscribe((data: any) => {
        this.dataSource.data = data.content;
        this.totalRows = data.totalElements;
        this.existsClientsToFilter = (data.numberOfElements > 0);

        if (!this.showClosedAccountsChecked) {
          this.dataSource.data = this.dataSource.data.filter((client: any) => client.status.value !== 'Closed');
          this.totalRows = this.dataSource.data.length;
          this.existsClientsToFilter = (this.totalRows > 0);
        }
        this.notExistsClientsToFilter = !this.existsClientsToFilter;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getClients();
  }

  sortChanged(event: Sort) {
    if (event.direction === '') {
      this.sortDirection = '';
      this.sortAttribute = '';
    } else {
      this.sortAttribute = event.active;
      this.sortDirection = event.direction;
    }
    this.resetPaginator();
    this.getClients();
  }

  private resetPaginator() {
    this.currentPage = 0;
    this.paginator.firstPage();
  }

  onChangeShowClosedAccount(event: any) {
    this.getClients();
  }

  showClientBlockingReasonDialog(clientId: string, statusId: string, displayName: string) {
    if (statusId == '900') {
      this.dialog.open(BlockingReasonDialogComponent, {
        data: {
          clientId,
          statusId,
          displayName
        },
        width: '50rem'
      });
    }
  }
}
