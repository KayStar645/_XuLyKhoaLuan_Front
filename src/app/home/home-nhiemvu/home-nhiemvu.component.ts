import { Title } from '@angular/platform-browser';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HomeMainComponent } from '../home-main/home-main.component';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-home-phancong',
  templateUrl: './home-nhiemvu.component.html',
  styleUrls: ['./home-nhiemvu.component.scss'],
})
export class HomeNhiemvuComponent implements OnInit, OnChanges {
  isTruongBM: boolean = false;
  isShowAddBtn: boolean = true;

  constructor(
    private titleService: Title,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách nhiệm vụ');

    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;

    this.websocketService.startConnection();
    this.websocketService.receiveFromNhiemVu((dataChange: boolean) => {
      if (dataChange) {
        this.isShowAddBtn = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onChangeCurrent(event: any) {
    this.isShowAddBtn = true;
  }

  onChangeInstruct(event: any) {
    this.isShowAddBtn = false;
  }

  onClickAdd(event: any) {
    this.isShowAddBtn = false;
  }
}
