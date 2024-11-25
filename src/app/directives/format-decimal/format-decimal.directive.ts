/** Angular Imports */
import {Directive, ElementRef, HostListener} from '@angular/core';
import {DecimalPipe} from '@angular/common';

/** Custom Services */
import {SettingsService} from '../../settings/settings.service';

/**
 * Format Number Directive
 */
@Directive({
  selector: '[mifosxFormatDecimal]'
})
export class FormatDecimalDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private decimalPipe: DecimalPipe,
    private settingsService: SettingsService
  ) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (!this.el.value || this.el.value.trim() === '') {
      this.el.value = null;
      return;
    }
    const decimals = this.settingsService.decimals;
    const locale = this.settingsService.language.code;
    const inputVal = this.el.value.replace(/[^0-9.]/g, '');
    const format = `1.${decimals}-${decimals}`;
    this.el.value = this.decimalPipe.transform(inputVal, format, locale);
  }

}
