import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemService } from '../../system.service';

@Injectable()
export class MasivianConfigurationResolver implements Resolve<Object> {
  constructor(private systemService: SystemService) {}
  resolve(): Observable<any> {
    return this.systemService.getExternalConfiguration('MASIVIAN_SERVICE');
  }
}
