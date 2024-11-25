import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'yesNo'
})
export class YesnoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }
  transform(value: boolean, ...args: unknown[]): string {
    if (value == null) {
      return null;
    }
    return value ? this.translateService.instant('labels.buttons.Yes') : this.translateService.instant('labels.buttons.No');
  }

}
