import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  constructor(private decimalFormat: DecimalPipe,
    private settingsService: SettingsService) {
  }

  transform(value: string | number, ...args: unknown[]): string {
    if (!value) {
     return '';
    }
    const locale = this.settingsService.language.code;
    let decimals = this.settingsService.decimals;
    if (args != null && args.length > 0) {
      decimals = args[0].toString();
    }
    const format = `1.${decimals}-${decimals}`;
    return this.decimalFormat.transform(value, format, locale);
  }

}
