import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getLocalstorage, setLocalstorage } from '../util/storage';

interface IcurrentSong {
  url: string,
  playing: boolean
}



const url_key = 'SONGID'



@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  // 当前播放歌曲全部信息
  currentSong$ = new BehaviorSubject<object>({})
  setCurrentSong_Info(state: object) {
    this.currentSong$.next(state)
  }

  // 当前歌曲信息
  Song: IcurrentSong = {
    url: '',
    playing: false
  }
  setSongUrl(id = getLocalstorage(url_key) || 'egg.org') {
    this.Song.url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    setLocalstorage(url_key, id)
  }

  setSongSate(state: boolean) {
    this.Song.playing = state
  }
}
