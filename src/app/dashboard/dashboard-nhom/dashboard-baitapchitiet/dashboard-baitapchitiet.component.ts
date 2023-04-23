import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { compareAsc, format, formatDistanceToNowStrict } from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form, getParentElement } from 'src/assets/utils';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  isOutDate: boolean = true;
  homeworkFiles: any[] = [];

  dtForm = new Form({
    nhanXet: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private binhLuanService: binhLuanService,
    private websocketService: WebsocketService,
    private httpClient: HttpClient
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

    if (compareAsc(new Date(), new Date(this.cviec.hanChot)) === 1) {
      this.isOutDate = true;
    }
  }

  catchDateTime() {
    this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace(
      '-',
      ' tháng '
    );
  }

  async onAddComment() {}

  async onConfirmFile(event: any) {
    const files = Array.from(event.target.files);
    let types = [
      'xlsx',
      'jpg',
      'png',
      'pptx',
      'sql',
      'docx',
      'txt',
      'pdf',
      'rar',
    ];

    files.forEach((file: any) => {
      let fileSplit: string[] = file.name.split('.');
      let type = fileSplit[fileSplit.length - 1];
      let item: any = {};

      if (types.includes(type)) {
        item['img'] = `../../../../assets/Images/file_type/${type}.png`;
      } else {
        item['img'] = `../../../../assets/Images/file_type/doc.png`;
      }

      item['name'] = file.name;
      item['type'] = type;

      this.homeworkFiles.push(item);
    });
  }

  async onAddFile() {
    let input: any = document.querySelector('.home-work input');

    input.click();
  }

  onRemveFileItem(event: any, name: String) {
    this.homeworkFiles.splice(
      this.homeworkFiles.findIndex((t) => t.name === name),
      1
    );
  }

  async onSubmitHomeWork() {}
}
