import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ClientsService } from '../clients.service';

@Component({
  selector: 'mifosx-client-blocking-reason-dialog',
  templateUrl: './client-blocking-reason-dialog.component.html',
  styleUrls: ['./client-blocking-reason-dialog.component.scss']
})
export class ClientBlockingReasonDialogComponent implements OnInit {

  displayedColumns: string[] = ['priority', 'name', 'description', 'blockDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isLoading: boolean = false;

  constructor(private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    this.fetchClientBlockingReasons();
    this.dataSource.data = []
  }

  fetchClientBlockingReasons() {
    this.isLoading = true;
    this.clientService.getClientBlockingReason(this.dialogData.clientId)
      .subscribe((data: any) => {
        this.dataSource.data = data;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      })
  }
}
