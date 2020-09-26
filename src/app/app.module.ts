import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from "./app-routing.module";
import { DiscoverModule } from './discover/discover.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerModule } from './playerWrap/player.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    SharedModule,
    DiscoverModule,
    BrowserAnimationsModule,
    PlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
