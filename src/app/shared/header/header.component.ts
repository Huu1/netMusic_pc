import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerService } from 'src/app/playerWrap/player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private playService: PlayerService) { }
  @Output() urlChange = new EventEmitter()

  isLogin: boolean = true

  // 菜单
  index = 0
  menuList = [
    {
      title: '发现音乐',
      url: 'discover'
    },
    {
      title: '我的音乐',
      url: 'my'
    },
    {
      title: '朋友'
    },
    {
      title: '山城 '
    },
    {
      title: '音乐人'
    },
    {
      title: '下载客户端'
    },
  ]

  // 子菜单
  subIndex = 0
  subMenuList = [
    {
      title: '推荐',
      url: 'discover'
    },
    {
      title: '排行榜',
      url: "toplist"
    },
    {
      title: '歌单'
    },
    {
      title: '主播电台'
    },
    {
      title: '歌手'
    },
    {
      title: '新碟上架'
    },
  ]
  ngOnInit() {

  }
  menuChange(i, menu) {
    this.index = i
    this.emitClick(menu)
  }
  subMenuChange(i, menu) {
    this.subIndex = i
    this.emitClick(menu)
  }
  emitClick(url: { title: string, url: string }) {
    this.urlChange.emit(url)
  }
  Login() {

  }
  setSong(e) {
    this.playService.setCurrentSong_Info(e)
  }
}
