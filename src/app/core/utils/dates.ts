import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class Dates {

  public static DEFAULT_DATEFORMAT = 'yyyy-MM-dd';
  public static DEFAULT_DATETIMEFORMAT = 'yyyy-MM-dd HH:mm';

  constructor(private datePipe: DatePipe) {}

  public getDate(timestamp: any): string {
    return this.datePipe.transform(timestamp, 'YYYY-MM-DD');
  }

  public formatDate(timestamp: any, dateFormat: string): string {
    const datePipe: DatePipe = new DatePipe(this.language.code);
    return datePipe.transform(timestamp, dateFormat);
  }

  public parseDate(value: any): Date {
    if (value instanceof Array) {
      return moment(value.join('-'), 'YYYY-MM-DD').toDate();
    } else {
      return moment(value).toDate();
    }
  }

  public parseDatetime(value: any): Date {
    return moment(value).toDate();
  }

  public convertToDate(value: any, format: string): Date {
    return moment(value).toDate();
  }

  get language() {
    if (!localStorage.getItem('mifosXLanguage')) {
      return 'en';
    }
    return JSON.parse(localStorage.getItem('mifosXLanguage'));
  }

  public getDateYYYYMMDDHH(date: Date): string {

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}${hours < 10 ? '0' + hours : hours}${minutes < 10 ? '0' + minutes : minutes}${seconds < 10 ? '0' + seconds : seconds}`
  }

}
