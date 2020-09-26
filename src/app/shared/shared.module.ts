import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { NotFoundComponent } from './notFound/notFound.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    SearchComponent,
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    SearchComponent
  ]
})
export class SharedModule { }
