import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {DatOption} from 'app/shared/models/general.model';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mifosx-data-selector',
  templateUrl: './data-selector.component.html',
  styleUrls: ['./data-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataSelectorComponent),
      multi: true
    }
  ]
})
export class DataSelectorComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() inputFormControl: UntypedFormControl;
  @Input() dataOptions: DatOption[] = [];
  @Input() required = false;
  @Input() inputLabel = '';
  @Input() datatableForm: UntypedFormGroup;
  @Output() onSelectionChangeEvent = new EventEmitter<any>();
  @Input() inputFormControlName: string;
  protected dataOption: ReplaySubject<DatOption[]> = new ReplaySubject<DatOption[]>(1);

  /** control for the filter select */
  protected filterFormCtrl: UntypedFormControl = new UntypedFormControl('');

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  placeHolderLabel = '';
  noEntriesFoundLabel = '';
  obj: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private translateService: TranslateService) { }

    writeValue(obj: any): void {
      this.obj = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }

  ngOnInit(): void {
    this.filterFormCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchData();
      });
    this.placeHolderLabel = this.translateService.instant('labels.inputs.Filter');
    this.noEntriesFoundLabel = this.translateService.instant('labels.text.No data found');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataOptions) {
      if (this.inputLabel === 'Categoria') {
        const sortOrder = ['CLIENTE GCO', 'PROVEEDOR GCO', 'TERCERO', 'INMOBILIARIO', 'OTRA'];
        this.dataOptions = this.dataOptions.sort((a, b) => {
          return (
            sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value)
          );
        });
      }
      this.dataOption.next(this.dataOptions.slice());
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  searchData(): void {
    if (this.dataOptions) {
      const search: string = this.filterFormCtrl.value.toLowerCase();
      if (!search) {
          this.dataOption.next(this.dataOptions.slice());
      } else {
        this.dataOption.next(this.dataOptions.filter((option: DatOption) => {
          const score = option.score ? option.score.toString() : '';
          return (option.value.toLowerCase().indexOf(search) >= 0 || score.toLowerCase().indexOf(search) >= 0);
        }));
      }
    }
  }

  callOnSelectionChange(event: any) {
    this.onSelectionChangeEvent.emit(event);
  }

}
