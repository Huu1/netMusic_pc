import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { from, fromEvent, merge, Observable, of } from 'rxjs';
import { concatAll, debounceTime, map, startWith, switchMap, withLatestFrom } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  @Output() selectItem = new EventEmitter();
  @ViewChild('search') search: ElementRef;
  @ViewChild('suggestList') suggestList: ElementRef;

  hasIuggest: boolean = false
  keys: string = ''
  loading: boolean = false
  list = [

  ]

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // 获取焦点
    const getFocus = fromEvent(this.search.nativeElement, 'focus')

    //失焦
    fromEvent(this.search.nativeElement, 'blur')
      .pipe(
        debounceTime(300)
      )
      .subscribe(res => {
        this.hasIuggest = false
      })

    // key
    const keyWord = fromEvent(this.search.nativeElement, 'input')

    // 下拉框
    const selectItem = fromEvent(this.suggestList.nativeElement, 'cllick').subscribe(res => console.log(res)
    )

    getFocus.pipe(
      map((e) => {
        this.hasIuggest = this.keys ? true : false
        return keyWord
      }),
      concatAll(),
      debounceTime(300),
      switchMap(
        (e: any): any => {
          this.list = []
          if (e.target.value) {
            this.hasIuggest = true
            this.loading = true
            return this.getSuggestList(e.target.value)
          } else {
            this.hasIuggest = false
            return of(1)
          }
        }
      )
    ).subscribe((res: any) => {
      const { code, result } = res
      this.loading = false
      if (code !== 200) return
      result.order && result.order.forEach(o => {
        let _obj = {
          title: '',
          value: []
        }
        _obj.title = o
        _obj.value = result[o].map(item => {
          return item
        })
        this.list.push(_obj)
      });
    }, error => {
      console.warn(error);
    })
  }
  getSuggestList(keywords) {
    return this.getSearch({ keywords })
  }

  getSearch(paramObj): Observable<{}> {
    let urlStr: string = `api/search/suggest?timestamp=${Date.now()}`
    return this.http.post(urlStr, paramObj)
  }

  format(str) {
    let res
    switch (str) {
      case 'songs':
        res = '歌曲'
        break;
      case 'playlists':
        res = '歌单'
        break;
      case 'albums':
        res = '专辑'
        break;
      default:
        res = '歌手'
        break;
    }
    return res
  }

  onClick(i, title) {
    this.selectItem.emit({
      type: title,
      data: i
    })
  }
}
