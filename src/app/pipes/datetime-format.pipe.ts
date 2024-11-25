import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import * as moment from 'moment';

@Pipe({
  name: 'datetimeFormat'
})
export class DatetimeFormatPipe implements PipeTransform {

  constructor(private settingsService: SettingsService) {
  }

  transform(value: any, datetimeFormat?: string, preserveUTC: boolean = false): any {
    const defaultDateFormat = this.settingsService.dateFormat.replace('dd', 'DD');
    if (typeof value === 'undefined') {
      return '';
    }

    let dateVal;
    if (value instanceof Array) {
      dateVal = moment(value.join('-'), 'YYYY-MM-DD HH:mm:ss');
    } else if (typeof value === 'string' && value.endsWith('Z') && preserveUTC) {
      // Handle UTC ISO string
      dateVal = moment.utc(value);
    } else {
      dateVal = moment(value);
    }

    if (datetimeFormat == null) {
      datetimeFormat = defaultDateFormat + ' HH:mm:ss';
    }

    if (preserveUTC) {
      return dateVal.utc().format(datetimeFormat);
    }

    return dateVal.format(datetimeFormat);
  }
}
