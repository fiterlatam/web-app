import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../../core/route/route.service';

import { CustomChargeTypeMapComponent } from './customchargetypemap.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'products/customchargetypemap',
      data: { title: 'Mapeo de Cargos Personalizados', breadcrumb: 'custom.charge.type.mapping' },
      component: CustomChargeTypeMapComponent,
    }
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomChargeTypeMapRoutingModule { }
