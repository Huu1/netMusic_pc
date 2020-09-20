import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverComponent } from './discover/discover.component';

@NgModule({
  declarations: [
    DiscoverComponent
  ],
  imports: [
    CommonModule,
    DiscoverRoutingModule
  ]
})
export class DiscoverModule { }
