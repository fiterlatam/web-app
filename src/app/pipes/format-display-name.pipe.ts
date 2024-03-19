import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDisplayName'
})
export class FormatDisplayNamePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value != null) {
      value = value.split('_cd_')[0];
      value = value[0].toUpperCase() + value.slice(1);
      value = value.replace(/_/g, ' ');
    }
    return value;
  }

}
