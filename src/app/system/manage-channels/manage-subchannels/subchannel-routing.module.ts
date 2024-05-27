import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../../../core/route/route.service';

import { SubChannelComponent } from './subchannel.component';
import { CreateSubChannelComponent } from './create-subchannel/create-subchannel.component';
import { EditSubChannelComponent } from './edit-subchannel/edit-subchannel.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'system/manage-system-channels/:channelId/subchannel',
      data: { title: 'Sub Channel', breadcrumb: 'subchannel' },
      component: SubChannelComponent,
    },
    {
      path: 'system/manage-system-channels/:channelId/subchannel/create',
      data: { title: 'Sub Channel', breadcrumb: 'subchannel.create' },
      component: CreateSubChannelComponent,
    },            
    {
      path: 'system/manage-system-channels/:channelId/subchannel/:id',
      data: { title: 'Sub Channel', breadcrumb: 'subchannel.edit' },
      component: EditSubChannelComponent,
    },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubChannelRoutingModule { }
