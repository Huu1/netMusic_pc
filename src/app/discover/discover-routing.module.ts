import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/notFound/notFound.component';
import { DiscoverComponent } from './discover/discover.component';
import { ToplistComponent } from './toplist/toplist.component';


const routes: Routes = [
  {
    path: 'discover',
    component: DiscoverComponent
  },
  {
    path:'toplist',
    component:ToplistComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule { }
