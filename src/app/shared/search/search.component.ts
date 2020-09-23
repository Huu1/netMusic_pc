import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('search') search: ElementRef
  @ViewChild('suggestList') suggestList: ElementRef

  hasIuggest: boolean = false
  keys: string = ''
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // 获取焦点
    const getFocus = fromEvent(this.search.nativeElement, 'focus')

    //失焦
    fromEvent(this.search.nativeElement, 'blur').subscribe(res => {
      this.hasIuggest = false
    })

    // key
    const keyWord = fromEvent(this.search.nativeElement, 'input')

    // 下拉框
    const selectItem = fromEvent(this.suggestList.nativeElement, 'cllick')



    getFocus.pipe(
      map((e) => {
        this.hasIuggest = this.keys ? true : false
        return keyWord
      }),
      concatAll(),
      debounceTime(300),
      switchMap(
        (e: any): any => {
          if (e.target.value) {
            this.hasIuggest = true
            return this.getSuggestList(e.target.value)
          } else {
            this.hasIuggest = false
            return of(1)
          }
        }
      )
    ).subscribe((res: any) => {
      if (res.code !== 200) return
      this.render(res.result)
    }, error => {
      console.log(error);
    })
  }
  getSuggestList(keywords) {
    return this.getSearch({ keywords })
  }

  getSearch(paramObj): Observable<{}> {
    let urlStr: string = `api/search/suggest?timestamp=${Date.now()}`
    return this.http.post(urlStr, paramObj)
  }

  render(res) {

  }

}
