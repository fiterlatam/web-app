import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../../core/route/route.service';

import { ChannelComponent } from './channel.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

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
  exports: [RouterModule]
})
export class ChannelRoutingModule { }
