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
import { ScrollBarComponent } from './scrollBar/scrollBar.component';
import { AlbumComponent } from "./album/album.component";
import { ArtistComponent } from "./artist/artist.component";
import { PlaylistComponent } from "./playlist/playlist.component";
import { SongComponent } from "./song/song.component";

const COMPONENETS = [
  HeaderComponent,
  NotFoundComponent,
  SearchComponent,
  ScrollBarComponent,
  AlbumComponent,
  ArtistComponent,
  PlaylistComponent,
  SongComponent
]
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
    ...COMPONENETS
  ],
  exports: [
    ...COMPONENETS
  ]
})
export class SharedModule { }
