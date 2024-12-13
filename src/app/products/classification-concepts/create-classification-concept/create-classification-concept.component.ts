/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

/** Custom Services */
import { ProductsService } from "../../products.service";
import { SettingsService } from "app/settings/settings.service";

/**
 * Create classificationConcept component.
 */
@Component({
  selector: "mifosx-create-classification-concept",
  templateUrl: "./create-classification-concept.component.html",
  styleUrls: ["./create-classification-concept.component.scss"],
})
export class CreateClassificationConceptComponent implements OnInit {
  /** Classification Concept form. */
  classificationConceptForm: UntypedFormGroup;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ProductsService} productsService Products Service.
   * @param {SettingsService} settingsService Settings Service
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  /**
   * Creates and sets the charge form.
   */
  ngOnInit() {
    this.createClassificationConceptForm();
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
   * Creates the classification concept form.
   */
  createClassificationConceptForm() {
    this.classificationConceptForm = this.formBuilder.group({
      concepto: ["", Validators.required],
      mandato: [false],
      excluido: [false],
      exento: [false],
      gravado: [false],
      norma: [""],
      tarifa: ["", this.getAmountValidators()],
    });
    this.classificationConceptForm.updateValueAndValidity();
  }

  /**
   * Submits the classification concept form and creates classification concept,
   * if successful redirects to classification concepts.
   */
  submit() {
    const classificationConceptFormData = this.classificationConceptForm.value;
    const locale = this.settingsService.language.code;

    if (locale === "es" && classificationConceptFormData.tarifa !== null) {
      classificationConceptFormData.tarifa = classificationConceptFormData.tarifa.replace(/\./g, "");
    }
    const data = {
      ...classificationConceptFormData,
      locale,
    };

    this.productsService.createClassificationConcept(data).subscribe((response: any) => {
      this.router.navigate(["../"], { relativeTo: this.route });
    });
  }
}
