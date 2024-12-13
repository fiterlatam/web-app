/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/** Custom Services */
import { ProductsService } from "app/products/products.service";
import { SettingsService } from "app/settings/settings.service";

/**
 * Edit Charge component.
 */
@Component({
  selector: "mifosx-edit-classification-concept",
  templateUrl: "./edit-classification-concept.component.html",
  styleUrls: ["./edit-classification-concept.component.scss"],
})
export class EditClassificationConceptComponent implements OnInit {
  showAnotherChargeCombobox = false;
  /** Selected Data. */
  classificationConceptData: any;
  /** Classification Concept form. */
  classificationConceptForm: UntypedFormGroup;

  /**
   * Retrieves the classification concept data from `resolve`.
   * @param {ProductsService} productsService Products Service.
   * @param formBuilder
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   * @param decimalPipe
   * @param {SystemService} systemService System Service
   */
  constructor(
    private productsService: ProductsService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
  ) {
    this.route.data.subscribe((data: { classificationConcept: any }) => {
      this.classificationConceptData = data.classificationConcept;
    });
  }

  ngOnInit() {
    this.editChargeForm();
  }

  getAmountValidators(): any[] {
    const locale = this.settingsService.language.code;
    const amountValidators = [];
    if (locale === "es") {
      amountValidators.push(Validators.pattern(/^(?!(?:\D*\d){15})([0-9]){1,9}(?:,\d{1,2})?$/));
    } else if (locale === "en") {
      amountValidators.push(Validators.pattern(/^(?!(?:\D*\d){15})([0-9]){1,9}(?:\.\d{1,2})?$/));
    } else {
      amountValidators.push(Validators.pattern(/^[0-9.,]*$/));
    }
    return amountValidators;
  }
  /**
   * Edit Classification Concept form.
   */
  editChargeForm() {
    this.classificationConceptForm = this.formBuilder.group({
      concepto: [this.classificationConceptData.concepto, Validators.required],
      mandato: [this.classificationConceptData.mandato],
      excluido: [this.classificationConceptData.excluido],
      exento: [this.classificationConceptData.exento],
      gravado: [this.classificationConceptData.gravado],
      norma: [this.classificationConceptData.norma],
      tarifa: [this.replaceCharactersFromAmount(this.classificationConceptData.tarifa), this.getAmountValidators()],
    });
  }

  /**
   * Submits Edit Classification Concept form.
   */
  submit() {
    const classificationConcept = this.classificationConceptForm.getRawValue();
    const locale = this.settingsService.language.code;
    classificationConcept.locale = locale;
    if (locale === "es" && classificationConcept.tarifa !== null) {
      classificationConcept.tarifa = classificationConcept.tarifa.replace(/\./g, "");
    }

    this.productsService
      .updateClassificationConcept(this.classificationConceptData.id.toString(), classificationConcept)
      .subscribe((response: any) => {
        this.router.navigate(["../"], { relativeTo: this.route });
      });
  }

  replaceCharactersFromAmount(amount: any): any {
    if (amount !== undefined && amount !== null) {
      if (this.settingsService.language.code === "es") {
        amount = amount.toString().replace(/,/g, "");
        return (amount = amount.toString().replace(/\./g, ","));
      } else {
        return amount;
      }
    } else {
      return "";
    }
  }
}
