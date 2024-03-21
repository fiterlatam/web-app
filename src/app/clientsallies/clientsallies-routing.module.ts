import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

import { ClientsalliesComponent } from './clientsallies.component';
import { CreateClientallyComponent } from './create-clientally/create-clientally.component';
import { EditClientallyComponent } from './edit-clientally/edit-clientally.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'clientsallies',
      data: { title: 'Aliados', breadcrumb: 'client.allies' },
      component: ClientsalliesComponent,
      /*
      children: [
        {
          path: 'create',
          data: { title: 'Create Clients Allies', breadcrumb: 'Create Clients Allies' },
          component: CreateClientallyComponent,
        },   
        {
          path: ':action',
          data: { title: 'Update Clients Allies', breadcrumb: 'Update Clients Allies' },
          component: EditClientallyComponent,
        },           
      ] */
    },
    {
      path: 'clientsallies/create',
      data: { title: 'Aliados', breadcrumb: 'client.allies.create' },
      component: CreateClientallyComponent,
    },            
    {
      path: 'clientsallies/:id',
      data: { title: 'Aliados', breadcrumb: 'client.allies.edit' },
      component: EditClientallyComponent,
    },

  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsalliesRoutingModule { }
