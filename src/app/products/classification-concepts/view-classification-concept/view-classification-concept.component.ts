/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

/** Custom Services */
import { ProductsService } from "app/products/products.service";

/** Custom Components */
import { DeleteDialogComponent } from "../../../shared/delete-dialog/delete-dialog.component";

/**
 * View Charge Component.
 */
@Component({
  selector: "mifosx-view-classification-concept",
  templateUrl: "./view-classification-concept.component.html",
  styleUrls: ["./view-classification-concept.component.scss"],
})
export class ViewClassficationConceptComponent implements OnInit {
  /** ClassificationConcept data. */
  classificationConceptData: any;
  /**
   * Retrieves the ClassificationConcept data from `resolve`.
   * @param {ProductsService} productsService Products Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.data.subscribe((data: { classificationConcept: any }) => {
      this.classificationConceptData = data.classificationConcept;
    });
  }

  ngOnInit() {}

  /**
   * Deletes the ClassificationConcept and redirects to ClassificationConcepts.
   */
  deleteClassificationConcept() {
    const deleteChargeDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `classificationConcept ${this.classificationConceptData.id}` },
    });
    deleteChargeDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.productsService.deleteClassificationConcept(this.classificationConceptData.id).subscribe(() => {
          this.router.navigate(["/products/classification-concepts"]);
        });
      }
    });
  }
}
