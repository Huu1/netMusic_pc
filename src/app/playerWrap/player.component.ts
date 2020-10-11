import { Component, ElementRef, HostBinding, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, from, fromEvent, interval, merge } from 'rxjs';
import { concatAll, debounceTime, first, map, startWith, take, takeUntil, throttle, throttleTime, withLatestFrom } from 'rxjs/operators';
import { getCurrentSong } from '../util/storage';
import { formatSongDuration } from '../util/time';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private rd2: Renderer2, public playService: PlayerService) { }

  // 播放器固定底部
  fixed: boolean = false

  // 歌曲播放链接
  songUrl

  //歌曲总时长
  duration: any = 0

  //歌曲当前时长
  current_time: string = '00:00'

  _current_time

  @ViewChild('player', { static: true }) player: ElementRef
  @ViewChild('audio', { static: true }) audio: ElementRef

  ngOnInit(): void {
    this.playWrapInit()
    this.playInit()
  }

  ngAfterViewInit(): void {
    this.playerWrapInit()

    this.audio.nativeElement.addEventListener('timeupdate', (res) => {
      this._current_time = (this.audio.nativeElement.currentTime / (this.duration / 1000))
      this.current_time = this.timeHandle(this.audio.nativeElement.currentTime)
    })
  }

  playWrapInit() {
    this.fixed = localStorage.getItem('PLAYER_FIX') === 'fix' ? true : false
  }

  playInit() {
    // 设置当前歌曲信息 后台返回
    this.playService.currentSong$
      .subscribe((res: any) => {
        if (!res) {
          let song = JSON.parse(getCurrentSong(this.playService.song_info))
          if (song) {
            this.songInit(song, true)
          }
        } else {
          this.songInit(res)
        }
      })
  }
  songInit(val, firstFlag = false) {
    this.playService.setSongUrl(val.id)
    this.duration = val.duration;
    this.audio.nativeElement.src = this.playService.Song.url;

    if (!firstFlag) {
      setTimeout(() => {
        this.playService.setSongSate(true)
        this.audio.nativeElement.play();
      }, 4)
    }
  }

  playerWrapInit() {
    // 首次进入 未固定1s后隐藏
    interval(1000).pipe(
      take(1)
    ).subscribe(e => { }, err => err, () => {
      if (!this.fixed) this.hide()
    })

    // 进入和离开dom
    merge(
      fromEvent(this.player.nativeElement, 'mouseenter'),
      fromEvent(this.player.nativeElement, 'mouseleave')
    ).pipe(
      debounceTime(500),
      map((e: any) => {
        return e.type === 'mouseleave' ? false : true
      })
    ).subscribe(res => {
      if (res) {
        this.show()
      } else if (!this.fixed) {
        this.hide()
      }
    })

    // 鼠标触底
    fromEvent(document, 'mousemove')
      .pipe(
        throttleTime(300),
        map((e: any) => {
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          return windowHeight - e.clientY < 20 ? true : false
        }),
      ).subscribe(e => {
        if (e && !this.fixed) {
          this.show()
        }
      })
  }

  pauseHandle() {
    if (this.audio.nativeElement.readyState === 0) return
    if (this.playService.Song.playing) {
      this.audio.nativeElement.pause()
      this.playService.setSongSate(false)
    } else {
      this.audio.nativeElement.play()
      this.playService.setSongSate(true)
    }
  }

  onHandle_SongOfRate(e) {

    this.audio.nativeElement.currentTime = this.duration / 1000 * e
  }

  timeHandle(time) {
    return formatSongDuration(time)
  }

  fixClick() {
    this.fixed = !this.fixed
    localStorage.setItem('PLAYER_FIX', this.fixed ? 'fix' : 'static')
  }

  hide() {
    this.rd2.setStyle(this.player.nativeElement, 'transform', 'translateY(50px)')
  }

  show() {
    this.rd2.setStyle(this.player.nativeElement, 'transform', 'translateY(0)')
  }

  // bug1  点击时滚动条任意地方 拖动时会改变
}
