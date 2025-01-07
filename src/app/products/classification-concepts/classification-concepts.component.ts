/** Angular Imports */
import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";

/** Custom Services */
import { PopoverService } from "../../configuration-wizard/popover/popover.service";
import { ConfigurationWizardService } from "../../configuration-wizard/configuration-wizard.service";

/**
 * ClassificationConcepts component.
 */
@Component({
  selector: "mifosx-classification-concepts",
  templateUrl: "./classification-concepts.component.html",
  styleUrls: ["./classification-concepts.component.scss"],
})
export class ClassificationConceptsComponent implements OnInit {
  /** ClassificationConcepts data. */
  classificationConceptData: any;
  /** Columns to be displayed in classification concepts table. */
  displayedColumns: string[] = ["concepto", "mandato", "excluido", "exento", "gravado", "norma", "tarifa"];
  /** Data source for classification concepts table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for classification concepts table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for classification concepts table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* Reference of create classification concepts button */
  @ViewChild("buttonCreateClassificationConcept") buttonCreateClassificationConcept: ElementRef<any>;
  /* Template for popover on create classification concepts button */
  @ViewChild("templateButtonCreateClassificationConcept") templateButtonCreateClassificationConcept: TemplateRef<any>;
  /* Reference of classification concepts table */
  @ViewChild("classificationConceptsTable") classificationConceptsTable: ElementRef<any>;
  /* Template for popover on classification concepts table */
  @ViewChild("templateClassificationConceptsTable") templateClassificationConceptsTable: TemplateRef<any>;

  /**
   * Retrieves the classification concepts data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router.
   * @param {ConfigurationWizardService} configurationWizardService ConfigurationWizard Service.
   * @param {PopoverService} popoverService PopoverService.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationWizardService: ConfigurationWizardService,
    private popoverService: PopoverService,
  ) {
    this.route.data.subscribe((data: { classificationConcepts: any }) => {
      this.classificationConceptData = data.classificationConcepts;
    });
  }

  /**
   * Filters data in classification concepts table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the classification concepts table.
   */
  ngOnInit() {
    this.setClassificationConcepts();
  }

  /**
   * Initializes the data source, paginator and sorter for classification concepts table.
   */
  setClassificationConcepts() {
    this.dataSource = new MatTableDataSource(this.classificationConceptData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (classificationConcept: any, property: any) => {
      switch (property) {
        case "concepto":
          return classificationConcept.concepto;
        default:
          return classificationConcept[property];
      }
    };
    this.dataSource.sort = this.sort;
  }
}
