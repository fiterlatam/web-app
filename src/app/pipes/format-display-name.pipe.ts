import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDisplayName'
})
export class FormatDisplayNamePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value != null) {
      const valueList = value.split('_cd_');
      if(valueList && valueList.length > 1){
        value = valueList[1];
      }else {
        value = valueList[0];
      }
      value = value[0].toUpperCase() + value.slice(1);
      value = value.replace(/_/g, ' ');
    }
    return value;
  }

}
