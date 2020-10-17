import { Component, ElementRef, OnInit, EventEmitter, Output, Renderer2, ViewChild, Input, SimpleChanges } from '@angular/core';
import { } from 'protractor'; import { fromEvent, interval, merge } from 'rxjs';
import { concatAll, debounceTime, map, startWith, take, takeUntil, throttle, throttleTime, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-scrollBar',
  templateUrl: './scrollBar.component.html',
  styleUrls: ['./scrollBar.component.scss']
})
export class ScrollBarComponent implements OnInit {

  constructor(private rd2: Renderer2) { }

  // 滚动条
  @ViewChild('barWrap') barWrap: ElementRef

  // 已播放部分
  @ViewChild('bar', { static: true }) bar: ElementRef

  // 拖动按钮
  @ViewChild('cicle', { static: true }) cicle: ElementRef


  // 滚动条进度
  @Output() present = new EventEmitter

  // 滑动时(改变时间)
  @Output() barProgress = new EventEmitter

  // 接收进度
  @Input() setPresent: number = 0

  circleLeft;

  barWrapWidth;

  flag: boolean = false;

  scrollValue: any;

  Progress: any;

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.flag) return
    let res = parseFloat(changes.setPresent.currentValue) * parseFloat(this.barWrapWidth);
    this.barChange(res);
  }

  ngAfterViewInit(): void {
    this.barEvent();
    // 屏幕宽度改变时
    fromEvent(window, 'resize').pipe(
      startWith(this.barWrap.nativeElement.getBoundingClientRect().left),
    )
      .subscribe((e) => {
        // 外圈滑动条距离 距离浏览器左边距离  用来计算滑动距离
        this.circleLeft = this.barWrap.nativeElement.getBoundingClientRect().left
      })
  }

  barEvent() {
    // 滚动条宽度
    this.barWrapWidth = this.barWrap.nativeElement.clientWidth

    // 圆圈点击
    const down$ = fromEvent(this.cicle.nativeElement, 'mousedown')

    // 移动
    const move$ = fromEvent(document, 'mousemove')

    // 松开鼠标
    const bodyup$ = fromEvent(document, 'mouseup').pipe(
      map(e => {
        if (this.flag) this.setProgress(this.scrollValue);
      })
    )

    // 1.拖动滚动条
    down$.pipe(
      // 将点击事件转换为在组件内移动事件
      map(e => move$.pipe(takeUntil(bodyup$))),

      // 摊平事件   相当于二维数组摊平
      concatAll(),

      // // 返回滑动距离
      map((move: any) => {
        return this.setBounds(move.clientX - this.circleLeft, 0, this.barWrapWidth)
      })
    ).subscribe(res => {
      this.flag = true;

      this.scrollValue = res;

      this.barProgress.emit({
        precent: this.scrollValue / this.barWrapWidth,
        flag: this.flag
      });

      this.barChange(res)
    }
    )

    // 2.点击滚动条跳转
    fromEvent(this.barWrap.nativeElement, 'mouseup').pipe(
      map((r: any) => this.setBounds(r.clientX - this.circleLeft, 0, this.barWrapWidth))
    ).subscribe(res => {
      this.setProgress(res);
      this.barChange(res);
    })
  }

  setProgress(res) {
    this.flag = false
    this.barProgress.emit({
      precent: null,
      flag: this.flag
    });
    this.present.emit(res / this.barWrapWidth)
  }

  barChange(value) {
    this.rd2.setStyle(this.cicle.nativeElement, 'transform', `translateX(${value}px)`)
    this.rd2.setStyle(this.bar.nativeElement, 'width', `${value}px`)
  }

  setBounds(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }
}
