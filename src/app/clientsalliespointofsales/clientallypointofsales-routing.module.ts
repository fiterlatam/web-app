import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

import { ClientAllyPointOfSalesComponent } from './clientallypointofsales.component';
import { CreateClientAllyPointOfSalesComponent } from './create-clientallypointofsales/create-clientallypointofsales.component';
import { EditClientAllyPointOfSalesComponent } from './edit-clientallypointofsales/edit-clientallypointofsales.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'clientally/:parentId/pointofsales',
      data: { title: 'Puntos de Ventas', breadcrumb: 'client.allies.point.of.sales' },
      component: ClientAllyPointOfSalesComponent,
    },
    {
      path: 'clientally/:parentId/pointofsales/create',
      data: { title: 'Puntos de Ventas', breadcrumb: 'client.allies.point.of.sales.create' },
      component: CreateClientAllyPointOfSalesComponent,
    },
    {
      path: 'clientally/:parentId/pointofsales/:id',
      data: { title: 'Puntos de Ventas', breadcrumb: 'client.allies.point.of.sales.edit' },
      component: EditClientAllyPointOfSalesComponent,
    },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAllyPointOfSalesRoutingModule { }
