import { Component, ElementRef } from '@angular/core';
import { format, formatDistanceToNowStrict, getDay } from 'date-fns';
import { KeHoach } from 'src/app/models/KeHoach.model';
import { keHoachService } from 'src/app/services/keHoach.service';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-ministry-danhsachkehoach',
  templateUrl: './ministry-danhsachkehoach.component.html',
  styleUrls: ['./ministry-danhsachkehoach.component.scss'],
})
export class MinistryDanhsachkehoachComponent {
  listKH: any[] = [];
  root: KeHoach[] = [];
  elementOld: any;
  nearTimeOutMS: any[] = [];

  constructor(
    private KeHoachService: keHoachService,
    private elementRef: ElementRef,
    private shareService: shareService
  ) {}

  async ngOnInit() {
    await this.getAllThongBao();
    this.getNearTimeOutMission();
  }

  async getAllThongBao() {
    this.listKH = await this.KeHoachService.getAll();
    this.root = this.listKH;
  }

  getNearTimeOutMission() {
    this.nearTimeOutMS = this.listKH
      .filter((nv: any) => {
        let date = new Date(nv.thoiGianKt);
        let dateBetween = parseInt(
          formatDistanceToNowStrict(date, {
            unit: 'day',
          }).split(' ')[0]
        );

        nv['thoiGianKt'] = format(new Date(nv.thoiGianKt), 'HH:mm');

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