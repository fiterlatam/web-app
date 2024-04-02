import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {GLAccount, LoanAssignor} from 'app/shared/models/general.model';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mifosx-loan-assignor-selector',
  templateUrl: './loan-assignor-selector.component.html',
  styleUrls: ['./loan-assignor-selector.component.scss']
})
export class LoanAssignorSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() inputFormControl: UntypedFormControl;
  @Input() loanAssignorOptions: LoanAssignor[] = [];
  @Input() required = false;
  @Input() inputLabel = '';

  /** GL Account data. */
  protected loanAssignorData: ReplaySubject<LoanAssignor[]> = new ReplaySubject<LoanAssignor[]>(1);

  /** control for the filter select */
  protected filterFormCtrl: UntypedFormControl = new UntypedFormControl('');

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  placeHolderLabel = '';
  noEntriesFoundLabel = '';

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    // listen for search field value changes
    this.filterFormCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchGLAccount();
      });

    this.placeHolderLabel = this.translateService.instant('labels.inputs.Filter');
    this.noEntriesFoundLabel = this.translateService.instant('labels.text.No data found');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.loanAssignorOptions) {
      this.loanAssignorData.next(this.loanAssignorOptions.slice());
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  searchGLAccount(): void {
    if (this.loanAssignorOptions) {
      const search: string = this.filterFormCtrl.value.toLowerCase();
      if (!search) {
          this.loanAssignorData.next(this.loanAssignorOptions.slice());
      } else {
        this.loanAssignorData.next(this.loanAssignorOptions.filter((option: LoanAssignor) => {
          return option.displayName.toLowerCase().indexOf(search) >= 0 || option.nit.toLowerCase().indexOf(search) >= 0;
        }));
      }
    }
  }

}
