import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'maskedDate'
})
export class MaskedDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | number, format: string): string | null {
    return this.datePipe.transform(value, format);
  }
}
