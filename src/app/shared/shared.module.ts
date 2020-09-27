import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { NotFoundComponent } from './notFound/notFound.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSliderModule } from '@angular/material/slider'
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSliderModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    SearchComponent,
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    SearchComponent,
    MatSliderModule
  ]
})
export class SharedModule { }
