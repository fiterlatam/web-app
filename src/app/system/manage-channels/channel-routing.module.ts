import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../../core/route/route.service';

import { ChannelComponent } from './channel.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import {CreateChannelResolver} from './create-channel/create-channel.resolver';

const routes: Routes = [
  Route.withShell([
    {
      path: 'system/manage-system-channels',
      data: { title: 'Channel', breadcrumb: 'channel' },
      component: ChannelComponent,
    },
    {
      path: 'system/manage-system-channels/create',
      data: { title: 'Channel', breadcrumb: 'channel.create' },
      component: CreateChannelComponent,
      resolve: {
        channelTemplate: CreateChannelResolver
      }
    },
    {
      path: 'system/manage-system-channels/:id',
      data: { title: 'Channel', breadcrumb: 'channel.edit' },
      component: EditChannelComponent,
    },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CreateChannelResolver
  ]
})
export class ChannelRoutingModule { }
