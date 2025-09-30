import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'app/products/products.service';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'mifosx-view-gac',
  templateUrl: './view-gac.component.html',
  styleUrls: ['./view-gac.component.scss']
})
export class ViewGacComponent implements OnInit {
  gacData: any;
  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private productsService: ProductsService,
              private router: Router
  ) {
    this.route.data.subscribe((data: { gac: any }) => {
      this.gacData = data.gac;
    });
  }

  ngOnInit() {
  }

  /**
     * Deletes the charge and redirects to charges.
     */
    deleteGac() {
      const deleteChargeDialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { deleteContext: `Gac ${this.gacData.id}` }
      });
      deleteChargeDialogRef.afterClosed().subscribe((response: any) => {
        if (response.delete) {
          this.productsService.deleteGac(this.gacData.id)
            .subscribe(() => {
              this.router.navigate(['/products/gac']);
            });
        }
      });
    }

}
