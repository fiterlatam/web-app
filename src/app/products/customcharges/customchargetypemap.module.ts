/** Angular Imports */
import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';


/** Custom Modules */
import { CustomChargeTypeMapRoutingModule } from './customchargetypemap-routing.module';
import { CustomChargeTypeMapComponent } from './customchargetypemap.component';
import { DeleteCustomChargeTypeMapDialogComponent } from './delete-customchargetypemap-dialog/delete-customchargetypemap-dialog.component';


@NgModule({
  declarations: [
    CustomChargeTypeMapComponent,
    DeleteCustomChargeTypeMapDialogComponent
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    CustomChargeTypeMapRoutingModule
  ]
})

export class CustomChargeTypeMapModule { }
