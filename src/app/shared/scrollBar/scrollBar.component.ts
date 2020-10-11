import { Component, ElementRef, OnInit, EventEmitter, Output, Renderer2, ViewChild, Input, SimpleChanges } from '@angular/core';
import { } from 'protractor'; import { fromEvent, merge } from 'rxjs';
import { concatAll, debounceTime, map, startWith, take, takeUntil, throttle, throttleTime, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-scrollBar',
  templateUrl: './scrollBar.component.html',
  styleUrls: ['./scrollBar.component.scss']
})
export class ScrollBarComponent implements OnInit {

  constructor(private rd2: Renderer2,) { }

  @ViewChild('barWrap') barWrap: ElementRef
  @ViewChild('bar', { static: true }) bar: ElementRef
  @ViewChild('cicle', { static: true }) cicle: ElementRef

  @Output() present = new EventEmitter

  @Input() setPresent: number = 0

  circleLeft;

  barWrapWidth;

  flag: boolean = false;

  scrollValue: any

  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.flag) return
    let res = parseFloat(changes.setPresent.currentValue) * parseFloat(this.barWrapWidth);
    this.barChange(res);
  }

  ngAfterViewInit(): void {
    this.barEvent();
  }

  barEvent() {
    // 滚动条宽度
    this.barWrapWidth = this.barWrap.nativeElement.clientWidth

    // 屏幕宽度改变时
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

    bodyup$.subscribe((e: any) => {
      if (e.target.className === 'innerCicle' || e.target.className === 'bar-wrap' || e.target.className === 'bar') {
        return
      }
      this.flag = false
      let res = this.setPresent * parseFloat(this.barWrapWidth);
      this.barChange(res);
    })

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
      map((move: any) => {
        return this.setBounds(move.clientX - this.circleLeft, 0, this.barWrapWidth)
      })
    ).subscribe(res => {
      this.flag = true
      this.scrollValue = res
      this.barChange(res)
    }
    )

    // 2.组件内部点击时滑动事件
    up$.pipe(
      map((r: any) => this.setBounds(r.clientX - this.circleLeft, 0, this.barWrapWidth))
    ).subscribe(res => {
      this.flag = false
      this.present.emit(res / this.barWrapWidth)
      this.barChange(res)
    })
  }

  barChange(value) {
    this.rd2.setStyle(this.cicle.nativeElement, 'transform', `translateX(${value}px)`)
    this.rd2.setStyle(this.bar.nativeElement, 'width', `${value}px`)
  }

  setBounds(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }
}
