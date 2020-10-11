import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { setCurrentSong, getCurrentSong } from '../util/storage';

interface IcurrentSong {
  url: string,
  playing: boolean
}




@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  song_info = 'SONGINFO'

  constructor(private http: HttpClient) { }

  // 当前播放歌曲全部信息
  currentSong$ = new BehaviorSubject<object>(null)
  setCurrentSong_Info(state: object) {
    this.currentSong$.next(state)
    setCurrentSong(this.song_info, JSON.stringify(state))
  }

  // 当前歌曲信息
  Song: IcurrentSong = {
    url: '',
    playing: false
  }

  setSongUrl(songID) {
    this.Song.url = `https://music.163.com/song/media/outer/url?id=${songID}.mp3`
  }

  // 播放状态
  setSongSate(state: boolean) {
    this.Song.playing = state
  }

}
