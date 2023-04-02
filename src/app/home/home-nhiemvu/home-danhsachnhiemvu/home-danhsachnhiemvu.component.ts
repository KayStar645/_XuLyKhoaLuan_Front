import { Component, ElementRef } from '@angular/core';
import { formatDistanceToNowStrict, getDay } from 'date-fns';
import format from 'date-fns/format';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-home-danhsachnhiemvu',
  templateUrl: './home-danhsachnhiemvu.component.html',
  styleUrls: ['./home-danhsachnhiemvu.component.scss'],
})
export class HomeDanhsachnhiemvuComponent {
  listNV: any[] = [];
  selectedTB: string = 'adsad';
  root: NhiemVu[] = [];
  lineTB = new NhiemVu();
  elementOld: any;
  nearTimeOutMS: any[] = [];

  constructor(
    private nhiemVuService: nhiemVuService,
    private elementRef: ElementRef,
    private shareService: shareService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    await this.getAllNhiemVu();
    this.getNearTimeOutMission();
  }

  async getAllNhiemVu() {
    this.listNV = await this.nhiemVuService.getAll();
    this.root = this.listNV;
  }

  getNearTimeOutMission() {
    this.nearTimeOutMS = this.listNV
      .filter((nv: any) => {
        let date = new Date(nv.thoiGianBd);
        let dateBetween = parseInt(
          formatDistanceToNowStrict(date, {
            unit: 'day',
          })[0]
        );

        let dayOfWeek = getDay(date) + 1;

        switch (dayOfWeek) {
          case 2:
            nv['thu'] = 'Thứ Hai';
            nv['number'] = 2;
            break;
          case 3:
            nv['thu'] = 'Thứ Ba';
            nv['number'] = 3;
            break;
          case 4:
            nv['thu'] = 'Thứ Tư';
            nv['number'] = 4;
            break;
          case 5:
            nv['thu'] = 'Thứ Năm';
            nv['number'] = 5;
            break;
          case 6:
            nv['thu'] = 'Thứ Sáu';
            nv['number'] = 6;
            break;
          case 7:
            nv['thu'] = 'Thứ Bảy';
            nv['number'] = 7;
            break;

          default:
            nv['thu'] = 'Chủ Nhật';
            nv['number'] = 1;
            break;
        }

        return dateBetween <= 7;
      })
      .sort((a, b) => a.number - b.number);
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
