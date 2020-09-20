import { Component, OnInit } from '@angular/core';
import { DiscoverService } from '../discover.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  constructor(private initService: DiscoverService) { }

  ngOnInit() {
    this.initService.Login({
      phone: 13221055266,
      password: "hy960820"
    }).subscribe(res => {
      console.log(res);
    })
  }

}
