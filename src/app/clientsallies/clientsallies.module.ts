/** Angular Imports */
import { NgModule } from '@angular/core';


/** Custom Modules */
import { ClientsalliesRoutingModule } from './clientsallies-routing.module';
import { ClientsalliesComponent } from './clientsallies.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { CreateClientallyComponent } from './create-clientally/create-clientally.component';
import { EditClientallyComponent } from './edit-clientally/edit-clientally.component';

@NgModule({
  declarations: [
    ClientsalliesComponent,
    CreateClientallyComponent,
    EditClientallyComponent, 
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    ClientsalliesRoutingModule
  ]
})

export class ClientsalliesModule { }
