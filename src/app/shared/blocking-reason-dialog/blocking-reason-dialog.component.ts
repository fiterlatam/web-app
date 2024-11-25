import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from 'app/clients/clients.service';
import { LoansService } from 'app/loans/loans.service';

@Component({
  selector: 'mifosx-blocking-reason-dialog',
  templateUrl: './blocking-reason-dialog.component.html',
  styleUrls: ['./blocking-reason-dialog.component.scss']
})
export class BlockingReasonDialogComponent implements OnInit {

  displayedColumns: string[] = ['priority', 'name', 'description', 'blockDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isLoading: boolean = false;

  constructor(private clientService: ClientsService, 
    private loanService: LoansService,

    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    if(this.dialogData.clientId){
      this.fetchClientBlockingReasons();
    }else{
      this.fetchLoanBlockingReasons();
    }
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

  fetchLoanBlockingReasons() {

    this.isLoading = true;
    this.loanService.getLoanBlockingReasons(this.dialogData.loanId)
      .subscribe((data: any) => {

        this.dataSource.data = data.map((reason: any) => { return { ...reason.blockReasonSetting, blockDate: reason.createdDate,description: reason.comment}})
        .map((reason: any) => {return {...reason, name: reason.nameOfReason}});
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      })
  }
}
