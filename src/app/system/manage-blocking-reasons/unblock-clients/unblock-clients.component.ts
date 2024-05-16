import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

import { SettingsService } from 'app/settings/settings.service';
import { ClientsService } from 'app/clients/clients.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-unblock-clients',
  templateUrl: './unblock-clients.component.html',
  styleUrls: ['./unblock-clients.component.scss']
})
export class UnblockClientsComponent implements OnInit {

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  unblockClientsForm: UntypedFormGroup;
  blockingReasons: any;
  filteredBlockingReasons: any;
  blockingReasonsLevels: String[] = ["CLIENT", "CREDIT"];
  displayedColumns: string[] = ['select', 'displayName', 'blockName', 'blockDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  isLoading: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private settingsService: SettingsService, 
    private clientsService: ClientsService,
    private dateUtils: Dates) {
    this.route.data.subscribe((data: { manageBlockingReasonsResolver: Object[] }) => {
      this.blockingReasons = data.manageBlockingReasonsResolver.filter((reason: any) => reason.isEnabled == true);
    });
   }

  ngOnInit(): void {
    this.maxDate = this.settingsService.businessDate;
    this.createForm();
    this.selection.changed.subscribe(() => {
      this.unblockClientsForm.patchValue({ clientId: this.selection.selected.map((item: any) => item.clientId) });
    });
  }

  isAllClientSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllClientSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllClientSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  createForm() {
    this.unblockClientsForm = this.formBuilder.group({
      'unblockDate': ['', Validators.required],
      'blockingReasonLevel': ['', Validators.required],
      'blockingReasonId': ['', Validators.required],
      'unblockComment': ['', [Validators.required, Validators.maxLength(255)]],
      'clientId': [[], Validators.required]
    });
  }

  filterBlockingReasons(level: string) {
    this.selection.clear();
    this.dataSource.data = [];
    this.filteredBlockingReasons = this.blockingReasons.filter((reason: any) => reason.level == level);
  }

  fetchClientsWithBlockingReason(blockingReasonId: string) {
    this.selection.clear();
    this.isLoading = true;
    this.clientsService.getAllClientsWithBlockingReason(blockingReasonId)
      .subscribe((data: any) => {
        this.dataSource.data = data;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      })

  }

  submit() {
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    const unblockDate: Date = this.unblockClientsForm.value.unblockDate;
    if(unblockDate instanceof Date) {
      this.unblockClientsForm.patchValue({ unblockDate: this.dateUtils.formatDate(unblockDate, dateFormat) });
    }

    const formData = {
      ...this.unblockClientsForm.value,
      dateFormat,
      locale
    }
    this.clientsService.unblockClientWithBlockingReason(formData).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
