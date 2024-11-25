/** Angular Imports */
import { NgModule } from '@angular/core';


/** Custom Modules */
import { ClientAllyPointOfSalesRoutingModule } from './clientallypointofsales-routing.module';
import { ClientAllyPointOfSalesComponent } from './clientallypointofsales.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { CreateClientAllyPointOfSalesComponent } from './create-clientallypointofsales/create-clientallypointofsales.component';
import { EditClientAllyPointOfSalesComponent } from './edit-clientallypointofsales/edit-clientallypointofsales.component';

@NgModule({
  declarations: [
    ClientAllyPointOfSalesComponent,
    CreateClientAllyPointOfSalesComponent,
    EditClientAllyPointOfSalesComponent,
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    ClientAllyPointOfSalesRoutingModule
  ]
})

export class ClientAllyPointOfSalesModule { }
