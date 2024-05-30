import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'maskedNumber'
})
export class MaskedNumberPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number, format: string): string | null {
    if (!value) {
        return '';
    }

    return this.decimalPipe.transform(value, format);
  }
}
