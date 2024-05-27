/** Angular Imports */
import { NgModule } from '@angular/core';


/** Custom Modules */
import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

@NgModule({
  declarations: [
    ChannelComponent,
    CreateChannelComponent,
    EditChannelComponent,
  ],
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    ChannelRoutingModule
  ]
})

export class ChannelModule { }
