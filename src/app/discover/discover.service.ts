import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  constructor(private http: HttpClient) { }

  Login(paramObj): Observable<{}> {
    let urlStr: string = 'api/login/cellphone'
    return this.http.post(urlStr, paramObj)
  }

}
