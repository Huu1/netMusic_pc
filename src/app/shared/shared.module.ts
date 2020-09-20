import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { NotFoundComponent } from './notFound/notFound.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundComponent,
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
