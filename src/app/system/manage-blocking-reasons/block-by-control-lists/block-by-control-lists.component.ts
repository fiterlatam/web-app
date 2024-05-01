import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup,UntypedFormBuilder } from '@angular/forms';
import { OrganizationService } from 'app/organization/organization.service';
import { Dates } from 'app/core/utils/dates';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'mifosx-block-by-control-lists',
  templateUrl: './block-by-control-lists.component.html',
  styleUrls: ['./block-by-control-lists.component.scss']
})
export class BlockByControlListsComponent implements OnInit {
  blockByControlListsForm: FormGroup;

    dataSource = new MatTableDataSource();

    template: File;
  
    urlSuffix: string = '/blockSettings';

    importsData: any;

    /** Columns to be displayed in imports table. */
    displayedColumns: string[] =
    [
      'name',
      'importTime',
      'endTime',
      'completed',
      'totalRecords',
      'successCount',
      'failureCount',
      'download'
    ];


  /** Paginator for imports table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for imports table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  /** Imports table reference */
  @ViewChild('importsTable', { static: true }) importsTableRef: MatTable<Element>;

  constructor(private route: ActivatedRoute, private fb: 
    UntypedFormBuilder,private organizationService: OrganizationService, 
    private dateUtils: Dates,) { 

    this.route.data.subscribe( (data: any) => {
      this.importsData = data.imports;
    });

    this.blockByControlListsForm = this.fb.group({
      controlName: [''],
      controlValue: [''],
      blockedReason: [''],
      blockByControlLists: ['']
    });
    console.log(this.importsData)
  }

  ngOnInit(): void {
    this.setImports();
  }

  refreshDocuments(){
    this.organizationService.getImports("clientblock").subscribe( (res: any) => {
      this.importsData = res;
      this.setImports();
    });
  }

    /**
   * Initializes the data source, paginator and sorter for imports table.
   */
    setImports() {
      this.dataSource = new MatTableDataSource(this.importsData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
  onFileSelect($event: any) {
    if ($event.target.files.length > 0) {
      this.template = $event.target.files[0];
    }
  }

  /**
   * Download template to bue used to upload data
   */

  downloadTemplate() {
    let date = new Date();
    let name = `lista_control_bloque_${this.dateUtils.getDateYYYYMMDDHH(date)}.xlsx`;
    this.organizationService.getImportTemplate(this.urlSuffix,null,null,'').subscribe( (res: any) => {
      const contentType = res.headers.get('Content-Type');
      const blob = new Blob([res.body], { type: contentType });
      const fileOfBlob = new File([blob], name, { type: contentType });
      window.open(window.URL.createObjectURL(fileOfBlob));
    });
  }

  uploadTemplate() {
    let legalFormType = '';
    /** Only for Client Bulk Imports */
    this.organizationService.uploadImportDocument(this.template, this.urlSuffix, legalFormType).subscribe(() => {});
  }
  

  /**
 * Download import document.
 * @param {string} name Import Name
 * @param {any} id ImportID
 */
  downloadDocument(name: string, id: any) {
    this.organizationService.getImportDocument(id).subscribe( (res: any) => {
      const contentType = res.headers.get('Content-Type');
      const blob = new Blob([res.body], { type: contentType });
      const fileOfBlob = new File([blob], name, { type: contentType });
      window.open(window.URL.createObjectURL(fileOfBlob));
    });
  }

}
