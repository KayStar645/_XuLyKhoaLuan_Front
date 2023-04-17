import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { format } from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { DashboardChitietthongbaoComponent } from '../../dashboard-thongbao/dashboard-chitietthongbao/dashboard-chitietthongbao.component';
import { DashboardComponent } from '../../dashboard.component';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-dashboard-baitapchitiet',
  templateUrl: './dashboard-baitapchitiet.component.html',
  styleUrls: ['./dashboard-baitapchitiet.component.scss'],
})
export class DashboardBaitapchitietComponent {
  maCV = '';
  cviec: CongViec = new CongViec();
  giangVien: GiangVien = new GiangVien();
  thoiHan = '';
  listBinhLuan: BinhLuan[] = [];

  dtForm = new Form({
    nhanXet: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private binhLuanService: binhLuanService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });
    this.cviec = await this.congViecService.getById(this.maCV);
    this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
    this.catchDateTime();
    this.listBinhLuan = (await this.binhLuanService.getAll()).filter(
      (bl) => bl.maCv == this.maCV
    );
    this.websocketService.startConnection();
  }

  catchDateTime() {
    this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace(
      '-',
      ' tháng '
    );
  }

  async onAddComment() {}
}
