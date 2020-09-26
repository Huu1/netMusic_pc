import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { logWarnings } from 'protractor/built/driverProviders';
import { BehaviorSubject, from, fromEvent, interval, merge } from 'rxjs';
import { debounceTime, map, startWith, take, throttle, throttleTime } from 'rxjs/operators';
import { setLocalstorage } from '../util/storage';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private rd2: Renderer2, public playService: PlayerService) { }
  fixed: boolean = false

  songUrl

  @ViewChild('player', { static: true }) player: ElementRef
  @ViewChild('audio', { static: true }) audio: ElementRef

  ngOnInit(): void {
    this.playWrapInit()
    this.playInit()
  }

  playWrapInit() {
    this.fixed = localStorage.getItem('PLAYER_FIX') === 'fix' ? true : false
  }

  playInit() {
    this.playService.currentSong$
      .subscribe((res: any) => {
        this.playService.setSongUrl(res.id)
      })

    merge(
      fromEvent(this.audio.nativeElement, 'playing'),
      fromEvent(this.audio.nativeElement, 'pause')
    ).subscribe((res: any) => {
      res.type === 'playing' ? this.playService.setSongSate(true) : this.playService.setSongSate(false)
    })

  }

  ngAfterViewInit(): void {

    // 首次进入 未锁定=>隐藏
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

  pauseHandle() {
    if (this.audio.nativeElement.readyState == '0') return
    if (this.playService.Song.playing) {
      this.audio.nativeElement.pause()
      this.playService.Song.playing = false
    } else {
      this.audio.nativeElement.play()
      this.playService.Song.playing = true
    }
  }
}
