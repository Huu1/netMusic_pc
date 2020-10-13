import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumComponent } from './shared/album/album.component';
import { ArtistComponent } from './shared/artist/artist.component';
import { PlaylistComponent } from './shared/playlist/playlist.component';
import { SongComponent } from './shared/song/song.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/discover' },
  { path: 'artist', component: ArtistComponent },
  { path: 'song', component: SongComponent },
  { path: 'album', component: AlbumComponent },
  { path: 'playlist', component: PlaylistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
