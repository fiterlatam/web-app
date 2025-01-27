import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HooksUtils {

  //create method to get payload url
  public getPayloadUrl(config: any): string {
    return this.getConfigValue('Payload URL', config);

  }

  getApiKey(config: any): string {
    return this.getConfigValue('API Key', config);
  }

  getContentType(config: any): string {
    return this.getConfigValue('Content Type', config);
  }

  getConfigValue(key: string, config: any): string {
    const configItem = config.find((item: { fieldName: string; }) => item.fieldName === key);
    return configItem ? configItem.fieldValue : '';
  }
}
