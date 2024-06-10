import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {ChannelService} from '../channel.service';
@Injectable()
export class CreateChannelResolver implements Resolve<Object> {
  constructor(private channelService: ChannelService) {}

  resolve(): Observable<any> {
    return this.channelService.getTemplate();
  }

}
