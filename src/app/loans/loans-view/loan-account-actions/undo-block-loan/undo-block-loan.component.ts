import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Dates } from "app/core/utils/dates";
import { LoansService } from "app/loans/loans.service";
import { SettingsService } from "app/settings/settings.service";

@Component({
  selector: "mifosx-undo-block-loan",
  templateUrl: "./undo-block-loan.component.html",
  styleUrls: ["./undo-block-loan.component.scss"],
})
export class UndoBlockLoanComponent implements OnInit {
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();

  loanBlocks: any[] = [];
  loanBlocksToDelete: any[] = [];
  unblockForm: UntypedFormGroup;

  /** When selected drop down will not be active and we can deelte everything availalbe */
  checkboxValue: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private loansService: LoansService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.loanBlocks = route.snapshot.data.actionButtonData;
  }

  ngOnInit(): void {
    this.createUndoBlockForm();
  }

  /**
   * Creates the block client form.
   */
  createUndoBlockForm() {
    this.unblockForm = this.formBuilder.group({
      undoBlockedOnDate: ["", Validators.required],
      blockingReasonId: [""],
      undoBlockingComment: ["", [Validators.required, Validators.maxLength(255)]],
      deleteAllAvailable: [false],
    });

    this.unblockForm.get("deleteAllAvailable").valueChanges.subscribe((value) => {
      this.checkboxValue = value;
      if (value) {
        this.loanBlocks.push(...this.loanBlocksToDelete);
        this.loanBlocksToDelete = this.loanBlocks;
        this.loanBlocks = [];
      } else {
        this.loanBlocks = this.loanBlocksToDelete;
        this.loanBlocksToDelete = [];
      }
    });
  }

  /**
   * Add to delete list when the block is selected
   * @param data
   */
  addToDeleteList(data: any) {
    this.loanBlocksToDelete.push(data);
    this.loanBlocks.splice(this.loanBlocks.indexOf(data), 1);
  }

  /**
   * Remove from delete list when the block is unselected
   * @param data
   */
  removeFromDeleteList(data: any) {
    this.loanBlocks.push(data);
    this.loanBlocksToDelete.splice(this.loanBlocksToDelete.indexOf(data), 1);
  }

  /**
   * Submits the form and unblocks the client.
   */
  submit() {
    const undoBlockFormValue = this.unblockForm.value;

    delete undoBlockFormValue.blockingReasonId;
    delete undoBlockFormValue.deleteAllAvailable;

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevUndoBlockedDate: Date = this.unblockForm.value.undoBlockedOnDate;

    if (undoBlockFormValue.undoBlockedOnDate instanceof Date) {
      undoBlockFormValue.undoBlockedOnDate = this.dateUtils.formatDate(prevUndoBlockedDate, dateFormat);
    }
    
    undoBlockFormValue.loanBlockIds = this.loanBlocksToDelete.map((block: any) => block.id);
    const loanId = this.loanBlocksToDelete[0].loanId;

    const data = {
      ...undoBlockFormValue,
      dateFormat,
      locale,
    };
    this.loansService.unblockLoan(loanId, data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
