import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route } from '../../core/route/route.service';
import { CustomChargeTypeMapComponent } from './customchargetypemap.component';
import {CreateChargeMapComponent} from './create-charge-map/create-charge-map.component';
import {CustomChargesResolver} from './create-charge-map/custom-charges.resolver';
import {ViewChargeMapComponent} from './view-charge-map/view-charge-map.component';
import {ViewChargeMapResolver} from './view-charge-map/view-charge-map.resolver';
import {EditChargeMapComponent} from './edit-charge-map/edit-charge-map.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'products/customchargetypemap',
      data: { title: 'Mapeo de Cargos Personalizados', breadcrumb: 'custom.charge.type.mapping' },
      children: [
          {
            path: '',
            component: CustomChargeTypeMapComponent
          },
          {
            path: 'create',
            component: CreateChargeMapComponent,
            data: { title: 'Create Custom Charge Mapping', breadcrumb: 'Create Custom Charge Mapping' },
            resolve: {
              customChargeTemplate: CustomChargesResolver
            }
          },
          {
            path: ':chargeMapId',
            data: { title: 'View Custom Charge Mapping', routeParamBreadcrumb: 'chargeMapId' },
            children: [
              {
                path: '',
                redirectTo: 'general',
                pathMatch: 'full'
              },
              {
                path: 'general',
                component: ViewChargeMapComponent,
                data: { title: 'General', breadcrumb: 'General', routeParamBreadcrumb: false },
                resolve: {
                  chargeMap: ViewChargeMapResolver
                }
              },
              {
                path: 'edit',
                component: EditChargeMapComponent,
                data: { title: 'Edit Custom Charge Mapping', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                resolve: {
                  chargeMapData: ViewChargeMapResolver,
                  customChargeTemplate: CustomChargesResolver
                }
              }
          ]
          }
        ]
    },
    {
      path: 'products/customchargetypemap/create',
      component: CreateChargeMapComponent,
      data: { title: 'Create Custom Charge Mapping', breadcrumb: 'Create' },
      resolve: {
        customChargeTemplate: CustomChargesResolver
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CustomChargesResolver,
    ViewChargeMapResolver,
    EditChargeMapComponent
  ]
})
export class CustomChargeTypeMapRoutingModule { }
