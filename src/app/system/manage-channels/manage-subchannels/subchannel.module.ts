/** Angular Imports */
import { NgModule } from '@angular/core';


/** Custom Modules */
import { SubChannelRoutingModule } from './subchannel-routing.module';
import { SubChannelComponent } from './subchannel.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { CreateSubChannelComponent } from './create-subchannel/create-subchannel.component';
import { EditSubChannelComponent } from './edit-subchannel/edit-subchannel.component';

@NgModule({
  declarations: [
    SubChannelComponent,
    CreateSubChannelComponent,
    EditSubChannelComponent,
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    SubChannelRoutingModule
  ]
})

export class SubChannelModule { }
