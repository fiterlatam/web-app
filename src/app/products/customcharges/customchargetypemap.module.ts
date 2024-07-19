/** Angular Imports */
import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';


/** Custom Modules */
import { CustomChargeTypeMapRoutingModule } from './customchargetypemap-routing.module';
import { CustomChargeTypeMapComponent } from './customchargetypemap.component';
import { DeleteCustomChargeTypeMapDialogComponent } from './delete-customchargetypemap-dialog/delete-customchargetypemap-dialog.component';
import {CreateChargeMapComponent} from './create-charge-map/create-charge-map.component';
import {ViewChargeMapComponent} from './view-charge-map/view-charge-map.component';
import {EditChargeMapComponent} from './edit-charge-map/edit-charge-map.component';
import {VipCommerceMapComponent} from './vip-commerce-map/vip-commerce-map.component';


@NgModule({
  declarations: [
    CustomChargeTypeMapComponent,
    CreateChargeMapComponent,
    EditChargeMapComponent,
    ViewChargeMapComponent,
    DeleteCustomChargeTypeMapDialogComponent,
    VipCommerceMapComponent
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    CustomChargeTypeMapRoutingModule
  ]
})

export class CustomChargeTypeMapModule { }
