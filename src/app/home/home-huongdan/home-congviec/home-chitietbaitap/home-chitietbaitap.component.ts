import { hdGopYService } from './../../../../services/hdGopY.service';
import { duyetDtService } from 'src/app/services/duyetDt.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { shareService } from 'src/app/services/share.service';
import { vi } from 'date-fns/locale';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DuyetDt } from 'src/app/models/DuyetDt.model';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { HdGopi } from 'src/app/models/HdGopi.model';
import { HomeDanhsachbaitapComponent } from '../home-danhsachbaitap/home-danhsachbaitap.component';

@Component({
  selector: 'app-home-chitietbaitap',
  templateUrl: './home-chitietbaitap.component.html',
  styleUrls: ['./home-chitietbaitap.component.scss'],
})
export class HomeChitietbaitapComponent {
  maCV = '';
  cviec: CongViec = new CongViec();
  giangVien: GiangVien = new GiangVien();
  thoiHan = '';
  listBinhLuan: BinhLuan[] = [];
  listHDGopy: any[] = [];

  GVInputConfig: any = {};

  dtForm = new Form({
    nhanXet: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private binhLuanService: binhLuanService,
    private hdGopYService: hdGopYService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });

    this.GVInputConfig.data = await this.giangVienService.getAll();
    this.GVInputConfig.keyword = 'tenGv';

    this.cviec = await this.congViecService.getById(this.maCV);
    this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
    this.catchDateTime();
    this.listBinhLuan = (await this.binhLuanService.getAll()).filter(
      (bl) => bl.maCv == this.maCV
    );

    await this.getComment();

    this.websocketService.startConnection();
  }

  catchDateTime() {
    this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace(
      '-',
      ' tháng '
    );
  }

  async getComment() {
    await this.hdGopYService.GetHdGopyByMacv(this.maCV).then((data) => {
      this.listHDGopy = data.map((t: any) => {
        return {
          ...t,
          thoiGian: formatDistanceToNowStrict(new Date(t.thoiGian), {
            locale: vi,
          }),
          tenGv: this.GVInputConfig.data.find((t2: any) => t2.maGv === t.maGv)
            .tenGv,
        };
      });
    });
  }

  async onAddComment() {
    const formValue: any = this.dtForm.form.value;
    const value: any = formValue.nhanXet;

    if (value) {
      try {
        let gopy = new HdGopi();

        gopy.init(
          value,
          format(new Date(), 'yyyy-MM-dd') +
            'T' +
            format(new Date(), 'HH:mm:ss'),
          this.maCV,
          HomeMainComponent.maGV,
          HomeDanhsachbaitapComponent.maDt
        );

        await this.hdGopYService.add(gopy);
        await this.getComment();
      } catch (error) {}
    }
  }
}
