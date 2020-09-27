import { Component, ElementRef, HostBinding, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, from, fromEvent, interval, merge } from 'rxjs';
import { concatAll, debounceTime, map, startWith, take, takeUntil, throttle, throttleTime, withLatestFrom } from 'rxjs/operators';
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

  circleLeft

  barWrapWidth

  @ViewChild('player', { static: true }) player: ElementRef
  @ViewChild('audio', { static: true }) audio: ElementRef
  @ViewChild('barWrap') barWrap: ElementRef
  @ViewChild('bar', { static: true }) bar: ElementRef
  @ViewChild('cicle', { static: true }) cicle: ElementRef

  ngOnInit(): void {
    this.playWrapInit()
    this.playInit()
  }
  ngAfterViewInit(): void {
    this.playerWrapInit()
    this.barEvent()
  }

  playWrapInit() {
    this.fixed = localStorage.getItem('PLAYER_FIX') === 'fix' ? true : false
  }

  playInit() {
    // 设置当前歌曲信息 后台返回
    this.playService.currentSong$
      .subscribe((res: any) => {
        this.playService.setSongUrl(res.id)
      })

    // 监听歌曲当前状态
    merge(
      fromEvent(this.audio.nativeElement, 'playing'),
      fromEvent(this.audio.nativeElement, 'pause')
    ).subscribe((res: any) => {
      res.type === 'playing' ? this.playService.setSongSate(true) : this.playService.setSongSate(false)
    })

  }

  barEvent() {
    this.barWrapWidth = this.barWrap.nativeElement.clientWidth

    fromEvent(window, 'resize').pipe(
      startWith(this.barWrap.nativeElement.getBoundingClientRect().left),
    )
      .subscribe((e) => {
        // 外圈滑动条距离 距离浏览器左边距离  用来计算滑动距离
        this.circleLeft = this.barWrap.nativeElement.getBoundingClientRect().left
      })

    // 外圈滑动条(组件内范围)移动
    const move$ = fromEvent(this.barWrap.nativeElement, 'mousemove')

    // 圆圈点击
    const down$ = fromEvent(this.cicle.nativeElement, 'mousedown')

    // 在外圈滑动条内 松开鼠标
    const up$ = fromEvent(this.barWrap.nativeElement, 'mouseup')

    // 在外圈滑动条外部 松开鼠标
    const bodyup$ = fromEvent(document, 'mouseup')



    // 1.点击圆圈时
    const a = down$.pipe(
      // 将点击事件转换为在组件内移动事件
      map(e => move$.pipe(
        // 直到在组件内松开鼠标时  停止移动事件
        takeUntil(up$)
      )),
      // 直到在组件外部松开鼠标时  停止移动事件   这个要加下 防止鼠标滑动时在外部松开 监听不到
      map(e => e.pipe(
        takeUntil(bodyup$)
      )),
      // 摊平事件   相当于二维数组摊平
      concatAll(),
      // 返回滑动距离
      map((move: any) => this.setBounds(move.clientX - this.circleLeft, 0, this.barWrapWidth))
    )

    // 组件内部点击时滑动事件
    const b = fromEvent(this.barWrap.nativeElement, 'click').pipe(
      map((r: any) => r.clientX - this.circleLeft)
    )

    merge(a, b).subscribe((res: any) => {
      // 设置圆圈+进度条滑动距离

      this.rd2.setStyle(this.cicle.nativeElement, 'transform', `translateX(${res}px)`)
      this.rd2.setStyle(this.bar.nativeElement, 'width', `${res}px`)
    }
    )

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

  setBounds(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }


  // bug1  点击时滚动条任意地方 拖动时会改变
}
